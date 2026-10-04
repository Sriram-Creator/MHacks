import { type ComponentProps } from 'react';
import { Text, TextInput, View } from 'react-native';

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: ComponentProps<typeof TextInput>['keyboardType'];
  autoCapitalize?: ComponentProps<typeof TextInput>['autoCapitalize'];
};

export function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  autoCapitalize,
}: LabeledInputProps) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-[15px] text-cocoa">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0A89C"
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`bg-white px-5 text-[16px] text-cocoa ${
          multiline ? 'min-h-[88px] rounded-[22px] py-3.5' : 'min-h-[52px] rounded-full'
        }`}
      />
    </View>
  );
}
