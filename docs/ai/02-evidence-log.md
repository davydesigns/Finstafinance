# Evidence log

Every source behind `01-research-brief.md`. **Verified** means I fetched the primary document and read the quoted figures. **Snippet** means I saw it only in a search-result summary, so treat it as unconfirmed.

| ID | Source | Date | Sample / type | Verified | Conf. | Caveats |
|---|---|---|---|---|---|---|
| E1 | Bank of America newsroom, "A Decade of AI Innovation: BofA's Virtual Assistant Erica Surpasses 3 Billion Client Interactions" · newsroom.bankofamerica.com/content/newsroom/press-releases/2025/08/a-decade-of-ai-innovation--bofa-s-virtual-assistant-erica-surpas.html | 20 Aug 2025 | Company press release | Verified | M | Self-reported. ">98% find the information they need" is not defined. Does not say which requests are most common. |
| E2 | CFPB, *Chatbots in Consumer Finance* (Issue Spotlight) · consumerfinance.gov/data-research/research-reports/chatbots-in-consumer-finance/ | Jun 2023 | Regulator report | Verified | H | Describes risks; **gives no concrete design recommendations**, only that institutions must meet existing obligations. Pre-dates mainstream LLM chat in banking. |
| E3 | CFPB Circular 2022-03, adverse action notification for credit decisions based on complex algorithms · consumerfinance.gov/compliance/circulars/ | May 2022 | Regulator guidance | Snippet | M | Search summaries report it **withdrawn in May 2025**. The ECOA / Reg B specific-reasons duty is statutory and continues. Confirm status with counsel. |
| E4 | TD Bank consumer AI survey, via Banking Dive · bankingdive.com/news/td-bank-customers-embrace-ai-human-customer-service/816203/ | 31 Mar 2026 | n>2,500 US consumers, bank-run | Verified | M | Self-reported attitudes. Sponsor has a commercial interest. |
| E5 | FINRA Investor Education Foundation study, via American Banker · americanbanker.com/news/ai-for-banking-faces-trust-hurdles-finra-foundation-study-says | Feb 2024 | n=1,033, US adults | Verified | H | Fielded before the 2025 to 2026 surge in consumer AI use. |
| E6 | Google PAIR, *People + AI Guidebook*, "Explainability + Trust" · pair.withgoogle.com/chapter/explainability-trust/ | Ongoing | Design guidance | Verified | H (as guidance) | Guidance, not an experiment. Itself says confidence displays need user testing. |
| E7 | Amershi et al., *Guidelines for Human-AI Interaction* (CHI 2019), Microsoft Research · microsoft.com/en-us/research/blog/guidelines-for-human-ai-interaction-design/ | 2019 | 18 guidelines, validated with 49 practitioners on 20 products | Verified | H | Pre-dates generative AI. The authors say it is not a checklist. |
| E8 | EU AI Act, Article 50(1), via artificialintelligenceact.eu/article/50/ | Applies 2 Aug 2026 | Regulation | Verified (text) | H | EU only. Exceptions when AI use is obvious. Check for later amendments to the dates. |
| E9 | W3C WCAG 2.2, SC 4.1.3 Status Messages (AA) | 2023 | Standard | Snippet | H | Implementation advice (`role="log"`, polite live regions) came from secondary summaries; confirm against W3C techniques. |
| E10 | WebAIM, *The WebAIM Million* · webaim.org/projects/million/ | Feb 2025 | 1,000,000 home pages, automated | Verified | H | Automated checks find only part of real failures, so true rates are higher. Home pages, not banking apps. |
| E11 | Tunic Pay / Opinium (UK) fraud-warning research, via fintech.global | Nov 2024 | UK adults, n not stated | Verified (article) | **L** | **Sponsor sells fraud products. No sample size.** Directional only. |
| E12 | Federal Reserve **SR 26-2** (with OCC Bulletin 2026-13, FDIC FIL-15-2026) · federalreserve.gov/supervisionreg/srletters/SR2602.htm | 17 Apr 2026 | Supervisory letter | Verified (replaces SR 11-7 and SR 21-8) | H | Secondary sources say generative and agentic AI are out of scope; **the fetched primary text did not mention AI at all**, so that is unconfirmed. |
| E13 | JPMorgan Chase, LLM Suite (employee platform; 200,000 users in eight months) · jpmorganchase.com | 2025 | Company statement | Snippet | L | Employee-facing. Not evidence about consumer features. |
| E14 | J.D. Power, 2025 U.S. Retail Banking Satisfaction Study · jdpower.com | 27 Mar 2025 | Annual consumer study | Snippet | M | Headline scores seen via press summary only. |

## Searched for and **not** found, or excluded

| Item | Why |
|---|---|
| Chase consumer-facing AI adoption or outcome numbers | No primary source found. A "25% higher engagement from AI personalisation" figure appears on an aggregator site with no citation, so it is **excluded**. |
| Apple Human Interface Guidelines, generative AI section | The fetch returned generic text rather than the page content, so **nothing is cited from it**. Worth reading directly. |
| NN/g chatbot usability study | The study found (n=8, mobile and desktop) is from the pre-LLM era, so it is **not used**. |
| US state AI-disclosure laws | Not researched. Counsel should list which apply by state. |
| Customer interview or analytics data | Does not exist for this project. |

## Quality notes

- Two of the headline figures (E4, E1) come from organisations that sell banking, so the attitude data is directional.
- Where sources disagreed (SR 11-7 dates, GenAI scope), I kept the version I could confirm in the primary text and flagged the rest.
- I did not compute shares from E1 (for example "proactive insights as a share of interactions"), because BofA's two counts measure different things.
