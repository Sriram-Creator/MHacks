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
      className={`h-10 items-center justify-center rounded-full border px-5 ${
        selected ? 'border-savor bg-savor' : 'border-cocoa/10 bg-white'
      }`}>
      <Text className={`text-[15px] font-medium ${selected ? 'text-mint' : 'text-cocoa'}`}>
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
