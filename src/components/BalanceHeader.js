import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import SummaryCard from './SummaryCard';

const BalanceHeader = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDark, setDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.headerBg, paddingTop: Math.max(insets.top, 12) },
      ]}
    >
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Ionicons name="wallet" size={22} color={colors.walletIcon} />
          <Text style={[styles.appTitle, { color: colors.titleOnHeader, marginLeft: 8 }]}>
            Ramfin
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={setDarkMode}
          trackColor={{
            false: 'rgba(255,255,255,0.28)',
            true: 'rgba(255,255,255,0.45)',
          }}
          thumbColor={isDark ? colors.primary : '#f8fafc'}
          ios_backgroundColor="rgba(255,255,255,0.2)"
          accessibilityLabel={isDark ? 'Matikan mode gelap' : 'Aktifkan mode gelap'}
        />
      </View>
      <SummaryCard />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default BalanceHeader;
