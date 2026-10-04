import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatPrice } from '@/components/buyer/format';
import { PrimaryButton } from '@/components/buyer/primary-button';
import { QuantityStepper } from '@/components/buyer/quantity-stepper';
import { useApp } from '@/context/AppContext';
import { getItem, getMaker, type BoxCadence } from '@/data/mock';

const cadences: { value: BoxCadence; label: string }[] = [
  { value: 'one-time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
];

export default function BoxScreen() {
  const { boxItems, boxCadence, setBoxCadence, updateBoxQuantity, repeatLastWeek } = useApp();

  const groups = boxItems.reduce<
    { makerId: string; makerName: string; lines: { itemId: string; name: string; photo: string; price: number; quantity: number }[] }[]
  >((acc, line) => {
    const item = getItem(line.itemId);
    const maker = item ? getMaker(item.maker_id) : undefined;
    if (!item || !maker) {
      return acc;
    }
    const existing = acc.find((group) => group.makerId === maker.id);
    const entry = {
      itemId: item.id,
      name: item.name,
      photo: item.photo,
      price: item.price,
      quantity: line.quantity,
    };
    if (existing) {
      existing.lines.push(entry);
    } else {
      acc.push({ makerId: maker.id, makerName: maker.name, lines: [entry] });
    }
    return acc;
  }, []);

  const subtotal = groups.reduce(
    (sum, group) => sum + group.lines.reduce((groupSum, line) => groupSum + line.price * line.quantity, 0),
    0,
  );

  return (
    <View className="flex-1 bg-cream">
      <ScrollView contentContainerClassName="px-5 pb-36 pt-2">
        <Pressable
          onPress={repeatLastWeek}
          className="min-h-[52px] items-center justify-center rounded-2xl border border-sage bg-white">
          <Text className="text-base font-semibold text-sage">Repeat last week</Text>
        </Pressable>

        <View className="mt-4 flex-row gap-3">
          {cadences.map((option) => {
            const selected = boxCadence === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setBoxCadence(option.value)}
                className={`min-h-[48px] flex-1 items-center justify-center rounded-2xl border ${
                  selected ? 'border-terracotta bg-terracotta' : 'border-savor/15 bg-white'
                }`}>
                <Text className={`text-base font-semibold ${selected ? 'text-cream' : 'text-savor'}`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {groups.length === 0 ? (
          <View className="mt-6 rounded-2xl bg-white p-6">
            <Text className="text-lg font-semibold text-savor">Your box is empty</Text>
            <Text className="mt-2 text-base leading-6 text-savor/70">
              Add items from a few makers. Everything still picks up in one meetup.
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.makerId} className="mt-5 rounded-2xl bg-white p-4">
              <Text className="text-base font-semibold text-savor">{group.makerName}</Text>
              {group.lines.map((line) => (
                <View key={line.itemId} className="mt-4 flex-row items-center">
                  <Image source={line.photo} contentFit="cover" className="h-16 w-16 rounded-xl" />
                  <View className="ml-3 flex-1">
                    <Text className="text-base font-semibold text-savor">{line.name}</Text>
                    <Text className="mt-1 text-sm text-terracotta">
                      {formatPrice(line.price * line.quantity)}
                    </Text>
                  </View>
                  <QuantityStepper
                    quantity={line.quantity}
                    onChange={(quantity) => updateBoxQuantity(line.itemId, quantity)}
                  />
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-cream px-5 pb-6 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-base text-savor/70">Subtotal</Text>
          <Text className="text-xl font-semibold text-savor">{formatPrice(subtotal)}</Text>
        </View>
        <PrimaryButton
          label="Checkout"
          disabled={groups.length === 0}
          onPress={() => router.push('/checkout')}
        />
      </View>
    </View>
  );
}
