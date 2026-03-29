import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useWallet from '../hooks/useWallet';
import { useTheme } from '../context/ThemeContext';

const formatRp = (n) =>
  `Rp ${Math.round(n || 0).toLocaleString('id-ID')}`;

const SummaryCard = () => {
  const { totalSaldo, totalMasuk, totalKeluar } = useWallet();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.summaryCardBg }]}>
      <Text style={[styles.cardLabel, { color: colors.textOnHeaderMuted }]}>
        Total Saldo Ramadan
      </Text>
      <Text style={[styles.cardBalance, { color: colors.textOnHeader }]}>{formatRp(totalSaldo)}</Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <Ionicons name="trending-up" size={18} color={colors.incomeTrend} />
          <Text style={[styles.subLabel, { color: colors.textOnHeaderMuted }]}>Masuk</Text>
          <Text style={[styles.subAmount, { color: colors.textOnHeader }]}>{formatRp(totalMasuk)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.summaryDivider }]} />
        <View style={styles.half}>
          <Ionicons name="trending-down" size={18} color={colors.expenseTrend} />
          <Text style={[styles.subLabel, { color: colors.textOnHeaderMuted }]}>Keluar</Text>
          <Text style={[styles.subAmount, { color: colors.textOnHeader }]}>{formatRp(totalKeluar)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardBalance: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  half: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  divider: {
    width: 1,
    marginHorizontal: 8,
  },
  subLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  subAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default SummaryCard;
