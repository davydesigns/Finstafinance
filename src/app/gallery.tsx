import { Button, Card, Row, Stack, Text, type ButtonSize, type ButtonVariant, type CardPadding, type CardVariant, type TextColor, type Tone } from '@/components/core';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';
import { ThemeSwitcher } from '@/gallery/ThemeSwitcher';
import { useTheme, type TextVariant } from '@/theme';

const TEXT_VARIANTS: TextVariant[] = ['heading1', 'heading2', 'heading3', 'body', 'bodyStrong', 'bodySmall', 'label', 'caption'];
const TEXT_COLORS: TextColor[] = ['primary', 'secondary', 'link', 'disabled'];
const TEXT_TONES: Tone[] = ['success', 'warning', 'danger', 'info', 'neutral'];
const BUTTON_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'destructive'];
const BUTTON_SIZES: ButtonSize[] = ['small', 'medium', 'large'];
const CARD_VARIANTS: CardVariant[] = ['default', 'elevated', 'outlined'];
const CARD_PADDINGS: CardPadding[] = ['sm', 'md', 'xl'];

const noop = () => undefined;

export default function DesignSystemGallery() {
  const { space } = useTheme();

  return (
    <GalleryScreen>
      <Text variant="heading1">Design System Gallery</Text>
      <Text color="secondary">Every variation of Text, Button and Card. Switch theme to check dark mode.</Text>
      <Stack style={{ marginTop: space[4] }}>
        <ThemeSwitcher />
      </Stack>

      {/* TEXT */}
      <Section title="Text: variants" note="Each variant caps how far system text scaling can grow it.">
        {TEXT_VARIANTS.map((variant) => (
          <Text key={variant} variant={variant}>
            {variant}: Send money safely
          </Text>
        ))}
      </Section>
      <Section title="Text: colour roles" note="`color` is a text role. It never carries status meaning.">
        {TEXT_COLORS.map((color) => (
          <Text key={color} color={color} variant="bodyStrong">
            {color}
          </Text>
        ))}
        <Text color="secondary" variant="bodySmall">
          `inverse` is for text on a filled action surface; Button handles that for you.
        </Text>
      </Section>
      <Section title="Text: tones" note="`tone` carries status. Always pair it with a word or icon, never colour alone.">
        {TEXT_TONES.map((tone) => (
          <Text key={tone} tone={tone} variant="bodyStrong">
            {tone}
          </Text>
        ))}
      </Section>

      {/* BUTTON */}
      {BUTTON_VARIANTS.map((variant) => (
        <Section
          key={variant}
          title={`Button: ${variant}`}
          note="Sizes small, medium, large. Then disabled and loading. Press and hold to see the pressed state."
        >
          <Stack align="start">
            {BUTTON_SIZES.map((size) => (
              <Button key={size} label={`${variant} ${size}`} variant={variant} size={size} onPress={noop} />
            ))}
            <Button label="Disabled" variant={variant} disabled onPress={noop} />
            <Button label="Loading" variant={variant} loading onPress={noop} />
          </Stack>
        </Section>
      ))}
      <Section title="Button: fullWidth" note="Spans its parent's width. Small buttons keep a 48pt tap area via hitSlop.">
        <Button label="Confirm transfer" fullWidth onPress={noop} />
        <Button label="Cancel transfer" variant="destructive" fullWidth onPress={noop} />
      </Section>
      <Section title="Button: parent decides" note="Components don't position themselves. Stack align='start' hugs content; Row wraps.">
        <Row wrap gap={2}>
          <Button label="One" variant="secondary" size="small" onPress={noop} />
          <Button label="Two" variant="secondary" size="small" onPress={noop} />
          <Button label="Three" variant="secondary" size="small" onPress={noop} />
        </Row>
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
      <Section title="Card: padding" note="Semantic sizes: sm 8pt, md 16pt, lg 24pt, xl 32pt.">
        {CARD_PADDINGS.map((padding) => (
          <Card key={padding} variant="outlined" padding={padding}>
            <Text variant="bodySmall">padding=&quot;{padding}&quot;</Text>
          </Card>
        ))}
      </Section>
      <Section title="Composed">
        <Card variant="elevated" padding="lg">
          <Stack gap={2}>
            <Text variant="bodySmall" color="secondary">
              Send to Alex
            </Text>
            <Text variant="heading1">Review transfer</Text>
            <Text color="secondary">You can cancel until it is processed.</Text>
            <Stack gap={2} style={{ marginTop: space[3] }}>
              <Button label="Confirm" fullWidth onPress={noop} />
              <Button label="Cancel transfer" variant="tertiary" fullWidth onPress={noop} />
            </Stack>
          </Stack>
        </Card>
      </Section>
    </GalleryScreen>
  );
}
