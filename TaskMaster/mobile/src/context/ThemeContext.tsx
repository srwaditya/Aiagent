import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_THEME, DARK_THEME } from '../../../shared/constants/colors';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: typeof LIGHT_THEME | typeof DARK_THEME;
  themeType: ThemeType;
  toggleTheme: () => void;
  setThemeType: (type: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: LIGHT_THEME,
  themeType: 'light',
  toggleTheme: () => {},
  setThemeType: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const deviceTheme = useColorScheme() as ThemeType;
  const [themeType, setThemeType] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the actual theme object based on theme type
  const theme = themeType === 'dark' ? DARK_THEME : LIGHT_THEME;
  
  // Load saved theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setThemeType(savedTheme);
        } else {
          // Use device theme if no saved preference
          setThemeType(deviceTheme || 'light');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setThemeType(deviceTheme || 'light');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, [deviceTheme]);
  
  // Toggle between light and dark themes
  const toggleTheme = async () => {
    try {
      const newTheme = themeType === 'light' ? 'dark' : 'light';
      setThemeType(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };
  
  // Set a specific theme
  const handleSetThemeType = async (type: ThemeType) => {
    try {
      setThemeType(type);
      await AsyncStorage.setItem('theme', type);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };
  
  // Listen for device theme changes
  useEffect(() => {
    if (!isLoading) {
      const checkDeviceTheme = async () => {
        try {
          const savedTheme = await AsyncStorage.getItem('theme');
          if (!savedTheme) {
            setThemeType(deviceTheme || 'light');
          }
        } catch (error) {
          console.error('Error checking device theme:', error);
        }
      };
      
      checkDeviceTheme();
    }
  }, [deviceTheme, isLoading]);
  
  if (isLoading) {
    return null; // Or a loading component
  }
  
  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme, setThemeType: handleSetThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};