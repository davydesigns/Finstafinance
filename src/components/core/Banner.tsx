import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

import { Button } from './Button';
import { IconBase, type IconName } from './Icon';
import { TextBase } from './Text';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'ai';

const ICON: Record<BannerTone, IconName> = {
  info: 'information-circle',
  success: 'checkmark-circle',
  warning: 'warning',
  danger: 'alert-circle',
  neutral: 'information-circle',
  ai: 'sparkles',
};

export interface BannerProps {
  tone?: BannerTone;
  title: string;
  /** Supporting text. */
  children?: ReactNode;
  /** One clear next step. */
  action?: { label: string; onPress: () => void };
  /** Show a dismiss control. Omit for notices that must stay (such as an AI disclosure). */
  onDismiss?: () => void;
  /** Interrupts screen readers immediately. Reserve for things that need attention right now. */
  urgent?: boolean;
}

/**
 * A notice with an icon AND words, so its meaning never depends on colour.
 * The title and text are read together as one sentence; the action stays separately focusable.
 */
export function Banner({ tone = 'info', title, children, action, onDismiss, urgent = false }: BannerProps) {
  const { colors, space, radius, borderWidth } = useTheme();
  const strings = useStrings();
  const ai = tone === 'ai';
  const background = ai ? colors.ai.subtle : colors.status[tone].background;
  const textColor = ai ? colors.ai.onSubtle : colors.status[tone].text;
  const accent = ai ? colors.ai.accent : colors.status[tone].text;
  const body = typeof children === 'string' ? children : undefined;

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: space[3],
        padding: space[4],
        borderRadius: radius.lg,
        backgroundColor: background,
        borderWidth: ai ? borderWidth.thin : borderWidth.none,
        borderColor: colors.ai.border,
      }}
    >
      <IconBase name={ICON[tone]} colorValue={accent} />
      <View style={{ flex: 1, gap: space[2] }}>
        <View
          accessible
          accessibilityRole={urgent ? 'alert' : undefined}
          accessibilityLiveRegion={urgent ? 'assertive' : undefined}
          accessibilityLabel={body ? `${title}. ${body}` : title}
          style={{ gap: space[1] }}
        >
          <TextBase variant="bodyStrong" colorValue={textColor}>
            {title}
          </TextBase>
          {typeof children === 'string' ? (
            <TextBase variant="bodySmall" colorValue={textColor}>
              {children}
            </TextBase>
          ) : (
            children
          )}
        </View>
        {action ? (
          <View style={{ alignItems: 'flex-start' }}>
            <Button label={action.label} variant="secondary" size="small" onPress={action.onPress} />
          </View>
        ) : null}
      </View>
      {onDismiss ? <Button label={strings.ai.dismiss} variant="tertiary" size="small" onPress={onDismiss} /> : null}
    </View>
  );
}
