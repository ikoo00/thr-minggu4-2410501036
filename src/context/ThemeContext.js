import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEME_STORAGE_KEY = '@ramfin_theme';

/** Palet terang (default) */
export const lightColors = {
  primary: '#0f766e',
  headerBg: '#0f766e',
  walletIcon: '#ffffff',
  titleOnHeader: '#ffffff',
  summaryCardBg: 'rgba(255,255,255,0.12)',
  summaryDivider: 'rgba(255,255,255,0.2)',
  textOnHeaderMuted: 'rgba(255,255,255,0.85)',
  textOnHeader: '#ffffff',
  incomeTrend: '#D1FAE5',
  expenseTrend: '#FECACA',
  screenAccentBg: '#0f766e',
  sheetBg: '#ffffff',
  background: '#ffffff',
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  rowSeparator: '#F3F4F6',
  inputBg: '#F9FAFB',
  placeholder: '#94A3B8',
  tabInactive: '#9CA3AF',
  tabBarBg: '#ffffff',
  segmentBg: '#E5E7EB',
  tabTextInactive: '#374151',
  danger: '#EF4444',
  expenseIcon: '#B91C1C',
  badgeIncomeBg: '#ECFDF5',
  badgeExpenseBg: '#FEF2F2',
  deleteBtnBg: '#FEF2F2',
  emptyCircle: '#F3F4F6',
  emptyIcon: '#D1D5DB',
  statsScreenBg: '#F9FAFB',
  filterIdleBg: 'rgba(255,255,255,0.12)',
  filterActiveBg: '#ffffff',
  filterLabel: '#ffffff',
  filterLabelActive: '#0f766e',
};

/** Palet gelap */
export const darkColors = {
  primary: '#2dd4bf',
  headerBg: '#134e4a',
  walletIcon: '#ecfdf5',
  titleOnHeader: '#f8fafc',
  summaryCardBg: 'rgba(255,255,255,0.12)',
  summaryDivider: 'rgba(255,255,255,0.2)',
  textOnHeaderMuted: 'rgba(248,250,252,0.9)',
  textOnHeader: '#f8fafc',
  incomeTrend: '#6ee7b7',
  expenseTrend: '#fca5a5',
  screenAccentBg: '#134e4a',
  sheetBg: '#1e293b',
  background: '#0f172a',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: '#334155',
  rowSeparator: '#334155',
  inputBg: '#334155',
  placeholder: '#94a3b8',
  tabInactive: '#64748b',
  tabBarBg: '#1e293b',
  segmentBg: '#334155',
  tabTextInactive: '#cbd5e1',
  danger: '#f87171',
  expenseIcon: '#f87171',
  badgeIncomeBg: '#064e3b',
  badgeExpenseBg: '#450a0a',
  deleteBtnBg: '#450a0a',
  emptyCircle: '#334155',
  emptyIcon: '#64748b',
  statsScreenBg: '#0f172a',
  filterIdleBg: 'rgba(255,255,255,0.12)',
  filterActiveBg: '#f1f5f9',
  filterLabel: '#f8fafc',
  filterLabelActive: '#0f766e',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (!cancelled) {
          setIsDark(saved === 'dark');
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light').catch(() => {});
  }, [isDark, hydrated]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  const value = useMemo(
    () => ({
      colors,
      isDark,
      hydrated,
      toggleTheme,
      setDarkMode: setIsDark,
    }),
    [colors, isDark, hydrated, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme harus dipakai di dalam ThemeProvider');
  }
  return ctx;
}

export default ThemeContext;
