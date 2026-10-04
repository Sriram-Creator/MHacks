import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Maker } from '@/data/mock';

type RadiusMapProps = {
  makers: Maker[];
  radius: number;
};

const PIN_ICONS = ['storefront', 'nutrition', 'cafe', 'basket', 'ice-cream'] as const;

export function RadiusMap({ makers, radius }: RadiusMapProps) {
  const ring = 90 + (radius / 25) * 70;

  return (
    <View style={styles.canvas}>
      <View style={[styles.road, styles.roadA]} />
      <View style={[styles.road, styles.roadB]} />

      <View
        style={[
          styles.ring,
          {
            width: ring * 2,
            height: ring * 2,
            borderRadius: ring,
          },
        ]}
      />

      <View style={styles.homePin}>
        <Ionicons name="home" size={12} color={colors.cream} />
      </View>

      {makers.slice(0, 5).map((maker, index) => {
        const angle = (index / Math.max(makers.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const distance = Math.min(maker.distance / radius, 0.92);
        const offset = ring * (0.45 + distance * 0.45);
        return (
          <View
            key={maker.id}
            style={[
              styles.makerPin,
              {
                transform: [
                  { translateX: Math.cos(angle) * offset },
                  { translateY: Math.sin(angle) * offset },
                ],
              },
            ]}>
            <Ionicons name={PIN_ICONS[index % PIN_ICONS.length]} size={11} color={colors.cream} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.map,
  },
  road: {
    position: 'absolute',
    height: 6,
    width: '140%',
    backgroundColor: '#D5DDD2',
  },
  roadA: {
    transform: [{ rotate: '28deg' }],
  },
  roadB: {
    transform: [{ rotate: '-38deg' }],
  },
  ring: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.sage,
    backgroundColor: 'transparent',
  },
  homePin: {
    position: 'absolute',
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
  },
  makerPin: {
    position: 'absolute',
    height: 26,
    width: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark,
  },
});
