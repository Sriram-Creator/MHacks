import { Platform } from 'react-native';

export const colors = {
  cream: '#F6F2EA',
  terracotta: '#C56B4A',
  sage: '#2F6B3A',
  dark: '#16301C',
  gold: '#D4A017',
  map: '#E6EEE3',
} as const;

/** Tailwind `rounded-2xl` — 1rem / 16px */
export const cardRadius = 16;

export const Colors = {
  light: {
    text: colors.dark,
    background: colors.cream,
    backgroundElement: '#EDE7DC',
    backgroundSelected: '#E2D8C8',
    textSecondary: '#5C6B5C',
  },
  dark: {
    text: colors.cream,
    background: colors.dark,
    backgroundElement: '#1F3A26',
    backgroundSelected: '#2A4A32',
    textSecondary: '#C5D0C4',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
