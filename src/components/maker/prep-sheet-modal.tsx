import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export type PrepLine = {
  id: string;
  label: string;
  count: number;
};

type PrepSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  lines: PrepLine[];
};

export function PrepSheetModal({ visible, onClose, lines }: PrepSheetModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-[28px] bg-cream px-5 pb-10 pt-5" style={{ maxHeight: '80%' }}>
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-2xl font-semibold text-savor">Prep sheet</Text>
            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Ionicons name="close" size={20} color={colors.dark} />
            </Pressable>
          </View>
          <Text className="mb-4 text-sm text-savor/60">Make this before Saturday cutoff</Text>

          <ScrollView>
            {lines.map((line) => (
              <View
                key={line.id}
                className="mb-2 flex-row items-center justify-between rounded-2xl bg-white px-4 py-4">
                <Text className="flex-1 pr-3 text-base font-semibold text-savor">{line.label}</Text>
                <Text className="text-xl font-semibold text-terracotta">{line.count}</Text>
              </View>
            ))}

            {lines.length === 0 ? (
              <Text className="py-6 text-base text-savor/45">Nothing to prep yet.</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
