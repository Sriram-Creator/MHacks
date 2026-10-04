import { type ComponentProps } from 'react';
import { Text, TextInput, View } from 'react-native';

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: ComponentProps<typeof TextInput>['keyboardType'];
  autoCapitalize?: ComponentProps<typeof TextInput>['autoCapitalize'];
  secureTextEntry?: boolean;
  className?: string;
};

export function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  className,
}: AuthFieldProps) {
  return (
    <View className={`mb-5 ${className ?? ''}`}>
      <Text className="mb-2 text-[15px] text-mint/80">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0A89C"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        className="min-h-[52px] rounded-full bg-white px-5 text-[16px] text-cocoa"
      />
    </View>
  );
}
