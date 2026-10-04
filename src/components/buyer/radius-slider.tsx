import { Pressable, Text, View } from 'react-native';

type Radius = 5 | 10 | 25;

type RadiusSliderProps = {
  value: Radius;
  onChange: (value: Radius) => void;
};

const stops: Radius[] = [5, 10, 25];

export function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  return (
    <View>
      <View className="h-8 justify-center">
        <View className="h-[3px] rounded-full bg-[#E4DDD2]" />
        <View className="absolute inset-x-0 flex-row items-center justify-between">
          {stops.map((stop) => {
            const selected = value === stop;
            return (
              <Pressable
                key={stop}
                onPress={() => onChange(stop)}
                hitSlop={12}
                className="h-8 w-8 items-center justify-center">
                <View
                  className={`rounded-full ${
                    selected ? 'h-5 w-5 bg-terracotta' : 'h-2.5 w-2.5 bg-[#C8C0B4]'
                  }`}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
      <View className="mt-1 flex-row justify-between">
        <Text className="text-xs text-savor/40">5 mi</Text>
        <Text className="text-xs text-savor/40">10 mi</Text>
        <Text className="text-xs text-savor/40">25 mi</Text>
      </View>
    </View>
  );
}
