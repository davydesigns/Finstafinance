import { View } from 'react-native';

import { Button, Card, Text, type ButtonSize, type ButtonVariant, type CardVariant, type TextColor } from '@/components/core';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { useTheme, type TypeVariant } from '@/theme';

const TEXT_VARIANTS: TypeVariant[] = ['heading1', 'heading2', 'heading3', 'body', 'bodyStrong', 'bodySmall', 'label', 'caption'];
const TEXT_COLORS: TextColor[] = ['primary', 'secondary', 'link', 'success', 'warning', 'danger', 'info', 'disabled'];
const BUTTON_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'destructive'];
const BUTTON_SIZES: ButtonSize[] = ['small', 'medium', 'large'];
const CARD_VARIANTS: CardVariant[] = ['default', 'elevated', 'outlined'];

const noop = () => undefined;

export default function DesignSystemGallery() {
  const { space, colors, radius } = useTheme();

  return (
    <GalleryScreen>
      <Text variant="heading1" accessibilityRole="header">
        Design System Gallery
      </Text>
      <Text color="secondary">Every variation of Text, Button and Card. Switch theme to check dark mode.</Text>
      <View style={{ marginTop: space[4] }}>
        <ThemeSwitcher />
      </View>

      {/* TEXT */}
      <Section title="Text: variants" note="Each variant caps how far system text scaling can grow it.">
        {TEXT_VARIANTS.map((variant) => (
          <Text key={variant} variant={variant}>
            {variant}: Send money safely
          </Text>
        ))}
      </Section>
      <Section title="Text: colour roles" note="Status colours must always pair with a word or icon, never colour alone.">
        {TEXT_COLORS.map((color) => (
          <Text key={color} color={color} variant="bodyStrong">
            {color}
          </Text>
        ))}
        <View style={{ backgroundColor: colors.action.primary, padding: space[3], borderRadius: radius.md }}>
          <Text color="onPrimary" variant="bodyStrong">
            onPrimary (on an action fill)
          </Text>
        </View>
      </Section>

      {/* BUTTON */}
      {BUTTON_VARIANTS.map((variant) => (
        <Section
          key={variant}
          title={`Button: ${variant}`}
          note="Sizes small, medium, large. Then disabled and loading. Press and hold to see the pressed state."
        >
          <View style={{ gap: space[3] }}>
            {BUTTON_SIZES.map((size) => (
              <Button key={size} title={`${variant} ${size}`} variant={variant} size={size} onPress={noop} />
            ))}
            <Button title="Disabled" variant={variant} disabled onPress={noop} />
            <Button title="Loading" variant={variant} loading onPress={noop} />
          </View>
        </Section>
      ))}
      <Section title="Button: fullWidth" note="Stretches to the container's width. Small buttons keep a 48pt tap area via hitSlop.">
        <Button title="Confirm transfer" fullWidth onPress={noop} />
        <Button title="Cancel transfer" variant="destructive" fullWidth onPress={noop} />
      </Section>

      {/* CARD */}
      <Section title="Card: variants" note="On the page background, so you can see the difference.">
        {CARD_VARIANTS.map((variant) => (
          <Card key={variant} variant={variant}>
            <Text variant="heading3">{variant}</Text>
            <Text color="secondary" variant="bodySmall">
              Everyday account · available balance
            </Text>
          </Card>
        ))}
      </Section>
      <Section title="Card: padding" note="A spacing token key: 2 = 8pt, 4 = 16pt, 8 = 32pt.">
        {([2, 4, 8] as const).map((padding) => (
          <Card key={padding} variant="outlined" padding={padding}>
            <Text variant="bodySmall">padding={padding}</Text>
          </Card>
        ))}
      </Section>
      <Section title="Composed">
        <Card variant="elevated" padding={6}>
          <Text variant="bodySmall" color="secondary">
            Send to Alex
          </Text>
          <Text variant="heading1">Review transfer</Text>
          <Text color="secondary">You can cancel until it is processed.</Text>
          <View style={{ gap: space[2], marginTop: space[3] }}>
            <Button title="Confirm" fullWidth onPress={noop} />
            <Button title="Cancel transfer" variant="tertiary" fullWidth onPress={noop} />
          </View>
        </Card>
      </Section>
    </GalleryScreen>
  );
}
