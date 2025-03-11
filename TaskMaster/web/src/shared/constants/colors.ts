export const COLORS = {
  // Primary colors
  primary: '#4361ee',
  primaryLight: '#738eef',
  primaryDark: '#2f4ad0',
  
  // Secondary colors
  secondary: '#3f37c9',
  secondaryLight: '#6a5fd9',
  secondaryDark: '#2a249a',
  
  // Accent colors
  accent: '#f72585',
  accentLight: '#f95fa0',
  accentDark: '#d01a6a',
  
  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Priority colors
  priorityHigh: '#f44336',
  priorityMedium: '#ff9800',
  priorityLow: '#4caf50',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',
  
  // Theme colors
  lightBackground: '#ffffff',
  lightSurface: '#f8f9fa',
  lightText: '#212529',
  
  darkBackground: '#121212',
  darkSurface: '#1e1e1e',
  darkText: '#e9ecef',
  
  // Transparent colors
  transparent: 'transparent',
  semiTransparent: 'rgba(0, 0, 0, 0.5)',
};

// Theme-specific color sets
export const LIGHT_THEME = {
  background: COLORS.lightBackground,
  surface: COLORS.lightSurface,
  text: COLORS.lightText,
  textSecondary: COLORS.gray600,
  border: COLORS.gray300,
  divider: COLORS.gray200,
};

export const DARK_THEME = {
  background: COLORS.darkBackground,
  surface: COLORS.darkSurface,
  text: COLORS.darkText,
  textSecondary: COLORS.gray400,
  border: COLORS.gray700,
  divider: COLORS.gray800,
};