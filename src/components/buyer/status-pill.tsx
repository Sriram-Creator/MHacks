import { Text, View } from 'react-native';

import type { OrderStatus } from '@/data/mock';

const styles: Record<OrderStatus, { wrap: string; text: string }> = {
  Confirmed: { wrap: 'bg-sage/15', text: 'text-sage' },
  'Being made': { wrap: 'bg-terracotta/15', text: 'text-terracotta' },
  'Ready for pickup': { wrap: 'bg-terracotta', text: 'text-cream' },
  'Picked up': { wrap: 'bg-savor/10', text: 'text-savor/60' },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const tone = styles[status];

  return (
    <View className={`rounded-full px-3 py-1.5 ${tone.wrap}`}>
      <Text className={`text-sm font-semibold ${tone.text}`}>{status}</Text>
    </View>
  );
}
