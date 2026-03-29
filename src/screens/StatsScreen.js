import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useWallet from '../hooks/useWallet';
import { useTheme } from '../context/ThemeContext';

const formatRp = (n) => `Rp ${Math.round(n || 0).toLocaleString('id-ID')}`;

const StatsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions, totalSaldo, totalMasuk, totalKeluar } = useWallet();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const styles = useMemo(() => createStyles(), []);

  const categoryTotals = useMemo(() => {
    const map = {};
    for (const t of transactions) {
      if (t.type !== 'pengeluaran') continue;
      const key = (t.category || 'Lainnya').trim() || 'Lainnya';
      map[key] = (map[key] || 0) + (Number(t.amount) || 0);
    }
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.statsScreenBg }]}>
      <View
        style={[
          styles.hero,
          { backgroundColor: colors.headerBg, paddingTop: Math.max(insets.top, 12) + 8 },
        ]}
      >
        <Text style={[styles.heroTitle, { color: colors.titleOnHeader }]}>Statistik Ramfin</Text>
        <Text style={[styles.heroSub, { color: colors.textOnHeaderMuted }]}>
          Ringkasan dari data transaksi Anda
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.sheetBg,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Total saldo</Text>
          <Text style={[styles.cardBig, { color: colors.text }]}>{formatRp(totalSaldo)}</Text>
          <View style={styles.row}>
            <View style={styles.half}>
              <Ionicons name="trending-up" size={18} color={colors.primary} />
              <Text style={[styles.muted, { color: colors.textSecondary }]}>Masuk</Text>
              <Text style={[styles.emph, { color: colors.text }]}>{formatRp(totalMasuk)}</Text>
            </View>
            <View style={[styles.vdiv, { backgroundColor: colors.border }]} />
            <View style={styles.half}>
              <Ionicons name="trending-down" size={18} color={colors.expenseIcon} />
              <Text style={[styles.muted, { color: colors.textSecondary }]}>Keluar</Text>
              <Text style={[styles.emph, { color: colors.text }]}>{formatRp(totalKeluar)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.75}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pengeluaran per kategori</Text>
          <Text style={[styles.chev, { color: colors.primary }]}>{expanded ? 'Sembunyikan' : 'Tampilkan'}</Text>
        </TouchableOpacity>
        {expanded && (
          <View
            style={[
              styles.list,
              { backgroundColor: colors.sheetBg, borderColor: colors.border },
            ]}
          >
            {categoryTotals.length === 0 ? (
              <Text style={[styles.empty, { color: colors.textMuted }]}>Belum ada pengeluaran tercatat</Text>
            ) : (
              categoryTotals.map((c, index) => (
                <View
                  key={c.name}
                  style={[
                    styles.catRow,
                    index < categoryTotals.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.rowSeparator,
                    },
                  ]}
                >
                  <Text style={[styles.catName, { color: colors.text }]}>{c.name}</Text>
                  <Text style={[styles.catAmt, { color: colors.text }]}>{formatRp(c.amount)}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    hero: {
      paddingHorizontal: 20,
      paddingBottom: 22,
    },
    heroTitle: {
      fontSize: 22,
      fontWeight: '900',
    },
    heroSub: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: '600',
    },
    content: {
      padding: 20,
      paddingBottom: 100,
    },
    card: {
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
    },
    cardLabel: {
      fontWeight: '700',
    },
    cardBig: {
      fontSize: 28,
      fontWeight: '900',
      marginTop: 6,
      marginBottom: 14,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    half: {
      flex: 1,
    },
    vdiv: {
      width: 1,
      marginHorizontal: 12,
    },
    muted: {
      marginTop: 6,
      fontWeight: '600',
    },
    emph: {
      fontWeight: '900',
      marginTop: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 18,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '900',
    },
    chev: {
      fontWeight: '800',
    },
    list: {
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
    },
    catRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    catName: {
      fontWeight: '700',
      flex: 1,
      paddingRight: 12,
    },
    catAmt: {
      fontWeight: '900',
    },
    empty: {
      padding: 16,
      fontWeight: '600',
    },
  });

export default StatsScreen;
