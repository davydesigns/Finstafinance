import { Button, Card, Text } from '@/components/core';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';

export default function CardGallery() {
  return (
    <GalleryScreen>
      <Section title="Outlined" note="Flat, with a border. The default for lists.">
        <Card>
          <Text variant="title3">Everyday account</Text>
          <Text color="secondary">Available balance</Text>
        </Card>
      </Section>

      <Section title="Raised" note="Floats above the page. In dark mode the surface is lighter instead of shadowed.">
        <Card variant="raised">
          <Text variant="title3">Payment sent</Text>
          <Text color="secondary">Your transfer is on its way.</Text>
        </Card>
      </Section>

      <Section title="Composed">
        <Card variant="raised" padding={6}>
          <Text variant="callout" color="secondary">
            Send to Alex
          </Text>
          <Text variant="title1">Review transfer</Text>
          <Text color="secondary">You can cancel until it is processed.</Text>
          <Button title="Confirm" fullWidth onPress={() => undefined} />
        </Card>
      </Section>
    </GalleryScreen>
  );
}
