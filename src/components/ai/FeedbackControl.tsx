import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, View } from 'react-native';

import { Chip } from '@/components/core/Chip';
import { TextBase } from '@/components/core/Text';
import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

export type FeedbackReason = 'wrong' | 'unclear' | 'irrelevant' | 'other';
export type Feedback = { polarity: 'helpful' } | { polarity: 'notHelpful'; reason: FeedbackReason };

const REASONS: FeedbackReason[] = ['wrong', 'unclear', 'irrelevant', 'other'];

/**
 * Two steps: helpful or not, then, only if not, WHY. Reasons make feedback something a team can
 * act on. Choices are words (not icon-only thumbs), the thanks is announced once, and
 * nothing here changes what the customer sees until they choose.
 */
export function FeedbackControl({ onSubmit }: { onSubmit: (feedback: Feedback) => void }) {
  const { colors, space } = useTheme();
  const strings = useStrings();
  const [stage, setStage] = useState<'ask' | 'reason' | 'done'>('ask');

  useEffect(() => {
    if (stage === 'done' && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(strings.ai.feedback.thanks);
  }, [stage, strings.ai.feedback.thanks]);

  if (stage === 'done') {
    return (
      <View accessibilityLiveRegion="polite">
        <TextBase variant="bodySmall" colorValue={colors.text.secondary}>
          {strings.ai.feedback.thanks}
        </TextBase>
      </View>
    );
  }

  return (
    <View style={{ gap: space[2] }}>
      <TextBase variant="bodySmall" colorValue={colors.text.secondary}>
        {stage === 'ask' ? strings.ai.feedback.question : strings.ai.feedback.reasonPrompt}
      </TextBase>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
        {stage === 'ask' ? (
          <>
            <Chip
              label={strings.ai.feedback.helpful}
              icon="thumbs-up"
              onPress={() => {
                onSubmit({ polarity: 'helpful' });
                setStage('done');
              }}
            />
            <Chip label={strings.ai.feedback.notHelpful} icon="thumbs-down" onPress={() => setStage('reason')} />
          </>
        ) : (
          REASONS.map((reason) => (
            <Chip
              key={reason}
              label={strings.ai.feedback.reasons[reason]}
              onPress={() => {
                onSubmit({ polarity: 'notHelpful', reason });
                setStage('done');
              }}
            />
          ))
        )}
      </View>
    </View>
  );
}
