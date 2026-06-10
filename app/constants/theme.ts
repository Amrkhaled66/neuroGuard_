/**
 * Shared light-mode tokens copied from the web palette in frontend/src/index.css.
 */

import { DefaultTheme, type Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

export const Palette = {
  green700: '#006044',
  green600: '#036c4d',
  green500: '#1f7a5a',
  green400: '#5cdcaf',
  green300: '#7af9cb',
  green200: '#82d7b1',
  green100: '#9ef4cc',
  green50: '#4fd1a5',
  red600: '#ba1a1a',
  red100: '#ffdad6',
  rose600: '#873d3b',
  rose100: '#ffdad8',
  appBackground: '#f7fcfa',
  appShell: '#eef4f1',
  surfaceRaised: '#ffffff',
  surfaceMuted: '#f2f4f3',
  textPrimary: '#14211c',
  textSecondary: '#53615a',
  textMuted: '#708078',
  borderSubtle: '#d9e3de',
  borderStrong: '#bec9c1',
} as const;

export const Colors = {
  light: {
    text: Palette.textPrimary,
    background: Palette.appBackground,
    tint: Palette.green700,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: Palette.green700,
    card: Palette.surfaceRaised,
    surfaceSoft: Palette.green100,
    border: Palette.borderSubtle,
    notification: Palette.red600,
  },
  dark: {
    text: Palette.textPrimary,
    background: Palette.appBackground,
    tint: Palette.green700,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: Palette.green700,
    card: Palette.surfaceRaised,
    surfaceSoft: Palette.green100,
    border: Palette.borderSubtle,
    notification: Palette.red600,
  },
};

export const NavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.notification,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
