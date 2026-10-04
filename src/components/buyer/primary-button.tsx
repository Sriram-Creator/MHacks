import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'terracotta' | 'forest';
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'terracotta',
}: PrimaryButtonProps) {
  const forest = variant === 'forest';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`min-h-[56px] items-center justify-center px-5 ${
        forest ? 'rounded-full' : 'rounded-2xl'
      } ${
        disabled
          ? forest
            ? 'bg-savor/35'
            : 'bg-terracotta/40'
          : forest
            ? 'bg-savor'
            : 'bg-terracotta'
      }`}>
      <Text className={`text-lg font-semibold ${forest ? 'text-mint' : 'text-cream'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
