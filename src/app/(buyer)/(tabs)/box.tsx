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
    <View className="flex-1 bg-mint">
      <ScrollView contentContainerClassName="px-5 pb-36 pt-2">
        <View className="flex-row rounded-full bg-white p-1">
          {cadences.map((option) => {
            const selected = boxCadence === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setBoxCadence(option.value)}
                className={`min-h-[44px] flex-1 items-center justify-center rounded-full ${
                  selected ? 'bg-savor' : 'bg-transparent'
                }`}>
                <Text
                  className={`text-[15px] font-semibold ${selected ? 'text-mint' : 'text-cocoa'}`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={repeatLastWeek}
          className="mt-3 min-h-[52px] items-center justify-center rounded-full bg-white">
          <Text className="text-[16px] font-medium text-cocoa">Repeat last week</Text>
        </Pressable>

        {groups.length === 0 ? (
          <View className="mt-6 rounded-[22px] bg-white p-6">
            <Text className="text-lg font-semibold text-cocoa">Your box is empty</Text>
            <Text className="mt-2 text-base leading-6 text-cocoa/70">
              Add items from a few makers. Everything still picks up in one meetup.
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.makerId} className="mt-7">
              <Text className="text-[18px] font-semibold text-cocoa">From {group.makerName}</Text>
              {group.lines.map((line) => (
                <View key={line.itemId} className="mt-4 flex-row items-center">
                  <Image
                    source={line.photo}
                    contentFit="cover"
                    className="h-14 w-14 rounded-[12px] bg-map"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="text-[16px] font-medium text-cocoa">{line.name}</Text>
                    <Text className="mt-0.5 text-[15px] text-cocoa/45">
                      {formatPrice(line.price)}
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

      <View className="absolute bottom-0 left-0 right-0 bg-mint px-5 pb-6 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[16px] text-cocoa">Subtotal</Text>
          <Text className="text-[16px] font-semibold text-cocoa">{formatPrice(subtotal)}</Text>
        </View>
        <PrimaryButton
          variant="forest"
          label="Checkout"
          disabled={groups.length === 0}
          onPress={() => router.push('/checkout')}
        />
      </View>
    </View>
  );
}
