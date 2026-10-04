import { Text, View } from 'react-native';

import type { OrderStatus } from '@/data/mock';

const styles: Record<OrderStatus, { wrap: string; text: string }> = {
  Confirmed: { wrap: 'border border-cocoa/10 bg-white', text: 'text-cocoa' },
  'Being made': { wrap: 'bg-[#EDE6DC]', text: 'text-cocoa' },
  'Ready for pickup': { wrap: 'bg-savor', text: 'text-mint' },
  'Picked up': { wrap: 'bg-mint', text: 'text-cocoa/50' },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const tone = styles[status];

  return (
    <View className={`rounded-full px-3 py-1.5 ${tone.wrap}`}>
      <Text className={`text-[13px] font-medium ${tone.text}`}>{status}</Text>
    </View>
  );
}
