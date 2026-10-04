import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'forest' | 'outline';
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'forest',
}: PrimaryButtonProps) {
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`min-h-[56px] items-center justify-center rounded-full px-5 ${
        outline
          ? 'bg-white'
          : disabled
            ? 'bg-savor/35'
            : 'bg-savor'
      }`}>
      <Text
        className={`text-[17px] font-semibold ${outline ? 'text-cocoa' : 'text-mint'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
