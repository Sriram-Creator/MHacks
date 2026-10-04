import { Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

export function LawBanner() {
  return (
    <View
      className="mx-5 mt-3 rounded-2xl bg-gold/20"
      style={{ paddingHorizontal: Spacing.three, paddingVertical: Spacing.two }}>
      <Text className="text-center text-xs font-medium leading-4 text-savor">
        Michigan law requires you to be able to contact the maker before buying.
      </Text>
    </View>
  );
}
