import { Platform } from 'react-native';

export const colors = {
  cream: '#FFF8F0',
  terracotta: '#C65D3B',
  sage: '#7A9E7E',
  dark: '#2B2118',
} as const;

/** Tailwind `rounded-2xl` — 1rem / 16px */
export const cardRadius = 16;

export const Colors = {
  light: {
    text: colors.dark,
    background: colors.cream,
    backgroundElement: '#F3E6D8',
    backgroundSelected: '#E8D4C4',
    textSecondary: '#6B5A4C',
  },
  dark: {
    text: colors.cream,
    background: colors.dark,
    backgroundElement: '#3D3228',
    backgroundSelected: '#4A3E32',
    textSecondary: '#C4B5A5',
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
