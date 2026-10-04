import { Pressable, Text, View } from 'react-native';

type QuantityStepperProps = {
  quantity: number;
  onChange: (quantity: number) => void;
};

export function QuantityStepper({ quantity, onChange }: QuantityStepperProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Pressable
        onPress={() => onChange(quantity - 1)}
        className="h-11 w-11 items-center justify-center rounded-full bg-cream">
        <Text className="text-2xl leading-7 text-savor">−</Text>
      </Pressable>
      <Text className="min-w-[28px] text-center text-lg font-semibold text-savor">{quantity}</Text>
      <Pressable
        onPress={() => onChange(quantity + 1)}
        className="h-11 w-11 items-center justify-center rounded-full bg-terracotta">
        <Text className="text-2xl leading-7 text-cream">+</Text>
      </Pressable>
    </View>
  );
}
