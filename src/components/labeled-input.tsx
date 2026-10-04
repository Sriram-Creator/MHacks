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
    <View className="mb-4">
      <Text className="mb-1.5 text-[11px] font-semibold uppercase tracking-[1.4px] text-savor/40">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#16301C66"
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-2xl bg-white px-4 text-base text-savor ${
          multiline ? 'min-h-[96px] py-3' : 'min-h-[52px]'
        }`}
      />
    </View>
  );
}
