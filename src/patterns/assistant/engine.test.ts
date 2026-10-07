import { classify, INITIAL_STATE, parseSend, respond, type EngineState } from './engine';

describe('classify(): regulated topics are caught broadly', () => {
  it.each([
    'I want to dispute a charge',
    'there is a wrong charge on my card',
    'I was charged me twice for dinner',
    "I didn't make this purchase",
    'this is an unauthorized transaction',
    'I need a refund',
    'billing error on my statement',
    'DISPUTE',
  ])('dispute: %s', (phrase) => expect(classify(phrase)).toBe('dispute'));

  it.each(['my card was stolen', "I've lost my card", 'I think I was scammed', 'suspicious activity', 'someone hacked my account', 'this is fraud'])(
    'fraud: %s',
    (phrase) => expect(classify(phrase)).toBe('fraud'),
  );

  it('fraud wins over everything else, even a payment request', () => {
    expect(classify('send $50 to sam, I think this is a scam')).toBe('fraud');
  });

  it('dispute wins over a person request, so the formal flow is still offered', () => {
    expect(classify('let me talk to a person about this refund')).toBe('dispute');
  });
});

describe('classify(): everyday intents', () => {
  it.each([
    ['What is my balance?', 'balance'],
    ['how much money do I have', 'balance'],
    ['How am I spending?', 'spending'],
    ['Send $50 to Sam Rivera', 'send'],
    ['pay Alex 20', 'send'],
    ['Hello', 'greeting'],
    ['talk to a person', 'human'],
    ['I want a human please', 'human'],
    ['purple monkey dishwasher', 'unknown'],
  ] as const)('%s -> %s', (phrase, intent) => expect(classify(phrase)).toBe(intent));
});

describe('parseSend()', () => {
  it('reads amount and recipient', () => {
    expect(parseSend('Send $50 to Sam Rivera')).toEqual({ amount: { minor: 5000, currency: 'USD' }, recipient: 'Sam Rivera' });
    expect(parseSend('pay 12.5 to alex')).toEqual({ amount: { minor: 1250, currency: 'USD' }, recipient: 'Alex' });
    expect(parseSend('transfer $1,200 to sam rivera today')).toEqual({ amount: { minor: 120000, currency: 'USD' }, recipient: 'Sam Rivera' });
  });

  it('reports what is missing instead of guessing', () => {
    expect(parseSend('send money').amount).toBeNull();
    expect(parseSend('send $50').recipient).toBeNull();
    expect(parseSend('send $0 to Sam').amount).toBeNull();
  });
});

describe('respond(): the safety rules', () => {
  it('RULE 1: disputes and fraud are routed, never answered in plain chat', () => {
    expect(respond('I want to dispute a charge').reply).toMatchObject({ kind: 'regulated', topic: 'dispute' });
    expect(respond('my card was stolen').reply).toMatchObject({ kind: 'regulated', topic: 'fraud' });
  });

  it('RULE 2: a request for a person always gets a person', () => {
    expect(respond('can I talk to someone').reply).toMatchObject({ kind: 'handoff', reason: 'requested' });
  });

  it('RULE 3: two misunderstandings in a row escalate (no doom loop)', () => {
    let state: EngineState = INITIAL_STATE;
    const first = respond('blorp', state);
    expect(first.reply.kind).toBe('text');
    state = first.state;
    const second = respond('flarp', state);
    expect(second.reply).toMatchObject({ kind: 'handoff', reason: 'struggling' });
  });

  it('understanding something resets the streak', () => {
    let state = respond('blorp').state;
    state = respond('what is my balance', state).state;
    expect(state.fallbackStreak).toBe(0);
    expect(respond('blorp', state).reply.kind).toBe('text');
  });

  it('the streak never reaches three without a handoff being offered', () => {
    let state: EngineState = INITIAL_STATE;
    const kinds: string[] = [];
    for (let i = 0; i < 5; i++) {
      const result = respond('gibberish ' + i, state);
      kinds.push(result.reply.kind);
      state = result.state;
    }
    expect(kinds.slice(1).every((kind) => kind === 'handoff')).toBe(true);
  });

  it('RULE 4: a payment is only ever PROPOSED, and says nothing was sent', () => {
    const { reply } = respond('Send $50 to Sam Rivera');
    expect(reply).toMatchObject({ kind: 'proposal', proposal: { recipient: 'Sam Rivera', amount: { minor: 5000 } } });
    expect(reply.text).toMatch(/haven't sent anything/);
  });

  it('flags a payee the customer has not paid before', () => {
    const { reply } = respond('send $20 to Jordan Lee');
    expect(reply.kind === 'proposal' && reply.proposal.warning).toMatch(/haven't paid Jordan Lee before/);
  });

  it('cautions on a large amount', () => {
    const { reply } = respond('send $2,000 to Sam Rivera');
    expect(reply.kind === 'proposal' && reply.proposal.warning).toMatch(/large amount/);
  });

  it('a known payee with a normal amount has no warning', () => {
    const { reply } = respond('send $50 to Sam Rivera');
    expect(reply.kind === 'proposal' && reply.proposal.warning).toBeUndefined();
  });

  it('asks for the missing detail instead of guessing, without counting as a failure', () => {
    const { reply, state } = respond('send money');
    expect(reply.kind).toBe('text');
    expect(state.fallbackStreak).toBe(0);
  });

  it('answers balance and spending from demo data, in money formatting', () => {
    expect(respond('balance').reply.text).toContain('$24,820.42');
    expect(respond('how am I spending').reply.text).toContain('$1,284.40');
  });
});
