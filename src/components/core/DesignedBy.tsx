import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useStrings } from '@/i18n';
import { useTheme } from '@/theme';

import { DESIGNER_LOGO_HEIGHT, DESIGNER_LOGO_PATH, DESIGNER_LOGO_WIDTH } from './designerLogoPath';
import { TextBase } from './Text';

export const DESIGNER_NAME = 'Davy Designs';

/**
 * The designer's credit: a small "Designed by Davy Designs" line with the maker's mark.
 *
 * WHERE IT BELONGS: quiet, out-of-the-way places. A site or app footer, an About or credits page, a
 * social preview card, the README.
 *
 * WHERE IT MUST NOT GO: the app header or primary brand slot, the app icon, favicon or splash screen
 * (those are the PRODUCT's identity, which is Finsta), screens that simulate a bank or handle money
 * (balances, transfers, fraud alerts), AI labels or disclosures, banners, errors, or anywhere a
 * customer is making a decision. A credit there reads as the product's own branding and erodes trust.
 */
export function DesignedBy() {
  const { colors, space } = useTheme();
  const strings = useStrings();
  const markHeight = space[4];
  const markWidth = (markHeight * DESIGNER_LOGO_WIDTH) / DESIGNER_LOGO_HEIGHT;

  return (
    <View
      accessible
      accessibilityLabel={`${strings.brand.designedBy} ${DESIGNER_NAME}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space[2] }}
    >
      <TextBase variant="caption" colorValue={colors.text.secondary}>
        {strings.brand.designedBy}
      </TextBase>
      <Svg width={markWidth} height={markHeight} viewBox={`0 0 ${DESIGNER_LOGO_WIDTH} ${DESIGNER_LOGO_HEIGHT}`}>
        <Path d={DESIGNER_LOGO_PATH} fill={colors.text.secondary} />
      </Svg>
      <TextBase variant="caption" colorValue={colors.text.secondary} style={{ fontWeight: '600' }}>
        {DESIGNER_NAME}
      </TextBase>
    </View>
  );
}
