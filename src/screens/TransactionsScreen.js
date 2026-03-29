import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useWallet from '../hooks/useWallet';
import { useTheme } from '../context/ThemeContext';
import FilterButtons from '../components/FilterButtons';
import TransactionList from '../components/TransactionList';

const TransactionsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions, removeTransaction, isLoading } = useWallet();
  const { colors } = useTheme();
  const [filter, setFilter] = useState('semua');
  const styles = useMemo(() => createStyles(), []);

  useEffect(() => {
    if (!isLoading) {
      console.log(`[Ramfin] Transaksi: filter=${filter}, total=${transactions.length}`);
    }
  }, [filter, isLoading, transactions.length]);

  const filtered = useMemo(() => {
    if (filter === 'semua') return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [filter, transactions]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.screenAccentBg }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.headerBg, paddingTop: Math.max(insets.top, 12) },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.titleOnHeader }]}>Semua Transaksi</Text>
        <FilterButtons filter={filter} onFilterChange={setFilter} />
      </View>
      <View style={[styles.body, { backgroundColor: colors.sheetBg }]}>
        <TransactionList
          transactions={filtered}
          onDelete={removeTransaction}
          emptyText="Tidak ada transaksi"
          emptyIcon="funnel-outline"
        />
      </View>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 14,
    },
    body: {
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -8,
      paddingTop: 16,
      overflow: 'hidden',
    },
  });

export default TransactionsScreen;
