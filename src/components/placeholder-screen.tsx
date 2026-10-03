import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-6">
        <View className="rounded-2xl bg-white p-6 shadow-sm">
          <Text className="text-3xl font-semibold text-savor">{title}</Text>
          <Text className="mt-3 text-base leading-6 text-savor/70">{description}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
