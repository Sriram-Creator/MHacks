import { Pressable, Text, View } from 'react-native';

type QuantityStepperProps = {
  quantity: number;
  onChange: (quantity: number) => void;
};

export function QuantityStepper({ quantity, onChange }: QuantityStepperProps) {
  return (
    <View className="h-10 flex-row items-center rounded-full bg-white px-1">
      <Pressable
        onPress={() => onChange(quantity - 1)}
        className="h-9 w-9 items-center justify-center">
        <Text className="text-xl leading-6 text-cocoa">−</Text>
      </Pressable>
      <Text className="min-w-[22px] text-center text-[16px] font-medium text-cocoa">
        {quantity}
      </Text>
      <Pressable
        onPress={() => onChange(quantity + 1)}
        className="h-9 w-9 items-center justify-center">
        <Text className="text-xl leading-6 text-cocoa">+</Text>
      </Pressable>
    </View>
  );
}
