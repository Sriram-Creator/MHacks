import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { BrandedSplash } from '@/components/branded-splash';
import { AppProvider, useApp } from '@/context/AppContext';

import '@/global.css';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

const MIN_SPLASH_MS = 1750;

export default function RootLayout() {
  return (
    <AppProvider>
      <SplashGate />
    </AppProvider>
  );
}

function SplashGate() {
  const { isAuthenticated } = useApp();
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });
  const [minElapsed, setMinElapsed] = useState(false);
  const [appVisible, setAppVisible] = useState(false);
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    SplashScreen.hideAsync();
    const timer = setTimeout(() => setMinElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || Boolean(fontError);
  const authReady = typeof isAuthenticated === 'boolean';
  const canDismiss = fontsReady && authReady && minElapsed;

  useEffect(() => {
    if (!canDismiss) {
      return;
    }

    SplashScreen.hideAsync();
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setAppVisible(true);
      }
    });
  }, [canDismiss, opacity]);

  return (
    <>
      <StatusBar style={appVisible ? 'dark' : 'light'} />
      {appVisible ? <RootNavigator /> : null}
      {!appVisible ? (
        <Animated.View style={[styles.splash, { opacity }]}>
          <BrandedSplash />
        </Animated.View>
      ) : null}
    </>
  );
}

function RootNavigator() {
  const { mode, isAuthenticated } = useApp();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated && mode === 'buyer'}>
        <Stack.Screen name="(buyer)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated && mode === 'maker'}>
        <Stack.Screen name="(maker)" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
});
