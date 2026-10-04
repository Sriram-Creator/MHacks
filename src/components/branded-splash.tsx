import { Dimensions, Image, StyleSheet, View } from 'react-native';

const IMAGE_WIDTH = Dimensions.get('window').width * 0.6;

export function BrandedSplash() {
  return (
    <View style={styles.screen}>
      <Image
        source={require('@/assets/images/splash-icon.png')}
        resizeMode="contain"
        style={styles.mark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B3A2A',
  },
  mark: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
  },
});
