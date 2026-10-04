import { Platform, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export function BrandedSplash() {
  return (
    <View style={styles.screen}>
      <Text style={styles.wordmark}>Savor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark,
  },
  wordmark: {
    color: colors.cream,
    fontSize: 56,
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
});
