import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type LegalBannerProps = {
  isLegal: boolean;
  stateName: string;
  reason?: string;
};

export function LegalBanner({ isLegal, stateName, reason }: LegalBannerProps) {
  return (
    <View
      className={`items-center rounded-full border px-5 py-3.5 ${
        isLegal ? 'border-cocoa/15 bg-white' : 'border-[#B3412F] bg-white'
      }`}>
      <View className="flex-row items-center">
        <Ionicons
          name={isLegal ? 'checkmark' : 'close'}
          size={18}
          color={isLegal ? colors.cocoa : '#B3412F'}
        />
        <Text
          className={`ml-2 text-[15px] ${isLegal ? 'text-cocoa' : 'text-[#B3412F]'}`}>
          {isLegal ? `Legal to sell in ${stateName}` : `Not allowed in ${stateName}`}
        </Text>
      </View>
      {!isLegal && reason ? (
        <Text className="mt-1 text-center text-sm leading-5 text-[#B3412F]">{reason}</Text>
      ) : null}
    </View>
  );
}
