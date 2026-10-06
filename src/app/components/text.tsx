import { Text, type TextColor } from '@/components/core';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';
import type { TypeVariant } from '@/theme';

const VARIANTS: TypeVariant[] = ['display', 'title1', 'title2', 'title3', 'body', 'bodyStrong', 'callout', 'caption'];
const COLORS: TextColor[] = ['primary', 'secondary', 'link', 'success', 'warning', 'danger', 'info', 'disabled'];

export default function TextGallery() {
  return (
    <GalleryScreen>
      <Section title="Variants" note="Each variant caps how far system text scaling can grow it.">
        {VARIANTS.map((variant) => (
          <Text key={variant} variant={variant}>
            {variant}: Send money safely
          </Text>
        ))}
      </Section>
      <Section title="Colour roles" note="Status colours always pair with a word, never colour alone.">
        {COLORS.map((color) => (
          <Text key={color} color={color} variant="bodyStrong">
            {color}
          </Text>
        ))}
      </Section>
    </GalleryScreen>
  );
}
