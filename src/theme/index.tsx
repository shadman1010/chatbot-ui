import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemePalette {
  name: 'dark' | 'light';
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  primary: string;
  primaryText: string;
  text: string;
  textDim: string;
  danger: string;
  accent: string;
  bubbleUser: string;
  bubbleBot: string;
  inputBg: string;
}

const dark: ThemePalette = {
  name: 'dark',
  background: '#0F1115',
  surface: '#12161C',
  surfaceAlt: '#1F2937',
  border: '#1F242C',
  primary: '#2563EB',
  primaryText: '#FFFFFF',
  text: '#F3F4F6',
  textDim: '#9CA3AF',
  danger: '#DC2626',
  accent: '#7C3AED',
  bubbleUser: '#2563EB',
  bubbleBot: '#1F2937',
  inputBg: '#1F2937'
};

const light: ThemePalette = {
  name: 'light',
  background: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceAlt: '#E5E7EB',
  border: '#D1D5DB',
  primary: '#2563EB',
  primaryText: '#FFFFFF',
  text: '#1F2937',
  textDim: '#4B5563',
  danger: '#DC2626',
  accent: '#7C3AED',
  bubbleUser: '#2563EB',
  bubbleBot: '#E5E7EB',
  inputBg: '#FFFFFF'
};

const STORAGE_KEY = 'chatbot.theme';

interface ThemeContextValue {
  theme: ThemePalette;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemePalette>(dark);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light') setTheme(light);
      } catch {}
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev.name === 'dark' ? light : dark;
      AsyncStorage.setItem(STORAGE_KEY, next.name).catch(() => {});
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
