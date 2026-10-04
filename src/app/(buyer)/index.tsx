import { Redirect } from 'expo-router';

/** Safety net if Expo lands on /(buyer) with no child route. */
export default function BuyerIndexRedirect() {
  return <Redirect href="/(buyer)/(tabs)" />;
}
