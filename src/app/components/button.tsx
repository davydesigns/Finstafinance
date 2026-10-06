import { useState } from 'react';
import { View } from 'react-native';

import { Button, Text } from '@/components/core';
import { GalleryScreen, Section } from '@/gallery/GalleryScreen';
import { useTheme } from '@/theme';

export default function ButtonGallery() {
  const { space } = useTheme();
  const [count, setCount] = useState(0);
  const press = () => setCount((n) => n + 1);

  return (
    <GalleryScreen>
      <Text variant="callout" color="secondary" accessibilityLiveRegion="polite">
        Presses registered: {count}
      </Text>

      <Section title="Variants">
        <View style={{ gap: space[3] }}>
          <Button title="Send money" onPress={press} />
          <Button title="Add recipient" variant="secondary" onPress={press} />
          <Button title="Skip for now" variant="tertiary" onPress={press} />
        </View>
      </Section>

      <Section title="Disabled" note="Disabled buttons are announced as dimmed by screen readers.">
        <View style={{ gap: space[3] }}>
          <Button title="Send money" disabled onPress={press} />
          <Button title="Add recipient" variant="secondary" disabled onPress={press} />
          <Button title="Skip for now" variant="tertiary" disabled onPress={press} />
        </View>
      </Section>

      <Section title="Loading" note="Presses are ignored and screen readers announce 'busy'.">
        <View style={{ gap: space[3] }}>
          <Button title="Sending" loading onPress={press} />
          <Button title="Sending" variant="secondary" loading onPress={press} />
        </View>
      </Section>

      <Section title="Full width">
        <Button title="Confirm transfer" fullWidth onPress={press} />
      </Section>
    </GalleryScreen>
  );
}
