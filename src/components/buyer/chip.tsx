import { type ReactNode } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[44px] items-center justify-center rounded-full border px-4 ${
        selected ? 'border-terracotta bg-terracotta' : 'border-savor/15 bg-white'
      }`}>
      <Text className={`text-base font-semibold ${selected ? 'text-cream' : 'text-savor'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

type ChipRowProps = {
  children: ReactNode;
};

export function ChipRow({ children }: ChipRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row items-center gap-2 px-5">
      {children}
    </ScrollView>
  );
}
