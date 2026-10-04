import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Maker } from '@/data/mock';

type RadiusMapProps = {
  makers: Maker[];
  radius: number;
};

const EXTRA_PINS = [
  { x: -118, y: -72 },
  { x: 96, y: -88 },
  { x: -72, y: 102 },
  { x: 124, y: 54 },
  { x: -140, y: 18 },
  { x: 38, y: -118 },
  { x: 148, y: -24 },
];

export function RadiusMap({ makers, radius }: RadiusMapProps) {
  const ring = 72 + (radius / 25) * 48;

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

      {EXTRA_PINS.map((pin, index) => (
        <View
          key={`extra-${index}`}
          style={[
            styles.makerPin,
            {
              transform: [{ translateX: pin.x }, { translateY: pin.y }],
            },
          ]}>
          <Ionicons name="location" size={9} color={colors.mint} />
        </View>
      ))}

      <View style={styles.homePin}>
        <Ionicons name="home-outline" size={16} color={colors.mint} />
      </View>

      {makers.slice(0, 10).map((maker, index) => {
        const angle = (index / Math.max(makers.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const distance = maker.distance / radius;
        const offset = ring * (0.28 + Math.min(distance, 1.35) * 0.62);
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
            <Ionicons name="location" size={9} color={colors.mint} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.mint,
  },
  road: {
    position: 'absolute',
    height: 2,
    width: '140%',
    backgroundColor: '#FFFFFF',
  },
  roadA: {
    transform: [{ rotate: '18deg' }],
  },
  roadB: {
    transform: [{ rotate: '-72deg' }],
  },
  ring: {
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: 'transparent',
  },
  homePin: {
    position: 'absolute',
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark,
    zIndex: 2,
  },
  makerPin: {
    position: 'absolute',
    height: 18,
    width: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sage,
  },
});
