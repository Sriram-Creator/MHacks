import { Pressable, Text, View } from 'react-native';

type ErrorRetryProps = {
  title?: string;
  message: string;
  onRetry: () => void;
};

/**
 * Shared error state with a Retry button. Shows the actual error text so
 * network problems are visible on device instead of an endless spinner.
 */
export function ErrorRetry({ title = "Couldn't load", message, onRetry }: ErrorRetryProps) {
  return (
    <View className="rounded-2xl bg-white p-5">
      <Text className="text-base font-semibold text-terracotta">{title}</Text>
      <Text className="mt-1 text-sm leading-5 text-savor/70">{message}</Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        className="mt-4 self-start rounded-2xl bg-terracotta px-5 py-3">
        <Text className="text-base font-semibold text-cream">Retry</Text>
      </Pressable>
    </View>
  );
}
