import { useRef } from 'react';
import { Text, View, type GestureResponderEvent } from 'react-native';

import { colors } from '@/constants/theme';

const MIN_RADIUS = 5;
const MAX_RADIUS = 25;

type RadiusSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

function clampRadius(value: number) {
  return Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, Math.round(value)));
}

export function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  const trackRef = useRef<View>(null);
  const widthRef = useRef(1);
  const originXRef = useRef(0);

  function measureTrack() {
    trackRef.current?.measureInWindow((x, _y, width) => {
      originXRef.current = x;
      widthRef.current = width || 1;
    });
  }

  function setFromPageX(pageX: number) {
    const ratio = (pageX - originXRef.current) / widthRef.current;
    onChange(clampRadius(MIN_RADIUS + ratio * (MAX_RADIUS - MIN_RADIUS)));
  }

  function onGrant(event: GestureResponderEvent) {
    measureTrack();
    const width = widthRef.current || 1;
    const ratio = event.nativeEvent.locationX / width;
    onChange(clampRadius(MIN_RADIUS + ratio * (MAX_RADIUS - MIN_RADIUS)));
  }

  function onMove(event: GestureResponderEvent) {
    setFromPageX(event.nativeEvent.pageX);
  }

  const thumbPercent = ((value - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS)) * 100;

  return (
    <View>
      <View
        ref={trackRef}
        onLayout={measureTrack}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={onGrant}
        onResponderMove={onMove}
        style={{ height: 44, justifyContent: 'center' }}
        collapsable={false}>
        <View style={{ height: 3, borderRadius: 99, backgroundColor: '#E4DDD2' }} />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: `${thumbPercent}%`,
            marginLeft: -10,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.terracotta,
          }}
        />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-xs text-savor/40">5 mi</Text>
        <Text className="text-xs text-savor/40">10 mi</Text>
        <Text className="text-xs text-savor/40">25 mi</Text>
      </View>
    </View>
  );
}
