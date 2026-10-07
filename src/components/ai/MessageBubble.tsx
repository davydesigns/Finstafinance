import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

import { AILabel } from './AILabel';
import { StreamingText } from './StreamingText';

export interface MessageBubbleProps {
  role: 'user' | 'assistant';
  text: string;
  /** Reveal the text gradually (assistant messages only). */
  animate?: boolean;
  onComplete?: () => void;
  /** Rich content shown under the bubble, such as a card. Kept separate so its controls stay reachable. */
  children?: ReactNode;
}

/**
 * One message in a conversation. Assistant messages carry the AI label and are announced as
 * "Assistant said, AI-generated: …" so the source is always clear, to everyone.
 */
export function MessageBubble({ role, text, animate = false, onComplete, children }: MessageBubbleProps) {
  const { colors, space, radius, borderWidth } = useTheme();
  const strings = useStrings();
  const user = role === 'user';

  const spoken = user ? `${strings.ai.youSaid}: ${text}` : `${strings.ai.assistantSaid}, ${strings.ai.label}: ${text}`;

  return (
    <View style={{ alignItems: user ? 'flex-end' : 'flex-start', gap: space[2] }}>
      <View
        accessible
        accessibilityLabel={spoken}
        style={{
          maxWidth: '88%',
          gap: space[2],
          paddingVertical: space[3],
          paddingHorizontal: space[4],
          borderRadius: radius.lg,
          backgroundColor: user ? colors.action.primary : colors.ai.subtle,
          borderWidth: user ? borderWidth.none : borderWidth.thin,
          borderColor: colors.ai.border,
        }}
      >
        {user ? null : <AILabel variant="compact" />}
        <StreamingText
          text={text}
          animate={!user && animate}
          onComplete={onComplete}
          colorValue={user ? colors.action.onPrimary : colors.ai.onSubtle}
        />
      </View>
      {children ? <View style={{ alignSelf: 'stretch' }}>{children}</View> : null}
    </View>
  );
}
