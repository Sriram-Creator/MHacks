import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`min-h-[56px] items-center justify-center rounded-2xl px-5 ${
        disabled ? 'bg-terracotta/40' : 'bg-terracotta'
      }`}>
      <Text className="text-lg font-semibold text-cream">{label}</Text>
    </Pressable>
  );
}
