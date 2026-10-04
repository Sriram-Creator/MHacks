import { Redirect } from 'expo-router';

/** Safety net if Expo lands on /(maker) with no child route. */
export default function MakerIndexRedirect() {
  console.log('[maker] index redirect → /(maker)/(tabs)/items');
  return <Redirect href="/(maker)/(tabs)/items" />;
}
