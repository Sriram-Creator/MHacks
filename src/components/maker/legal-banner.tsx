import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

const RED = '#B3412F';

type LegalBannerProps = {
  isLegal: boolean;
  stateName: string;
  reason?: string;
};

export function LegalBanner({ isLegal, stateName, reason }: LegalBannerProps) {
  return (
    <View
      className="rounded-2xl px-5 py-4"
      style={{ backgroundColor: isLegal ? colors.sage : RED }}>
      <Text className="text-lg font-semibold text-cream">
        {isLegal ? `✓ Legal to sell in ${stateName}` : `✗ Not allowed in ${stateName}`}
      </Text>
      {!isLegal && reason ? (
        <Text className="mt-1 text-sm leading-5 text-cream/90">{reason}</Text>
      ) : null}
    </View>
  );
}
