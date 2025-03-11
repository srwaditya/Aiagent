import React, { createContext, useContext, useState, useEffect } from 'react';
import { LIGHT_THEME, DARK_THEME } from '../shared/constants/colors';

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
  // Check if user has a saved theme preference
  const getSavedTheme = (): ThemeType => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    
    // Check system preference if no saved theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };
  
  const [themeType, setThemeType] = useState<ThemeType>(getSavedTheme());
  
  // Get the actual theme object based on theme type
  const theme = themeType === 'dark' ? DARK_THEME : LIGHT_THEME;
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeType(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };
  
  // Set a specific theme
  const handleSetThemeType = (type: ThemeType) => {
    setThemeType(type);
    localStorage.setItem('theme', type);
  };
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change theme if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setThemeType(e.matches ? 'dark' : 'light');
      }
    };
    
    // Add listener for theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme, setThemeType: handleSetThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};