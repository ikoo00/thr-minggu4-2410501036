import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useWallet from '../hooks/useWallet';
import { useTheme } from '../context/ThemeContext';
import BalanceHeader from '../components/BalanceHeader';
import TransactionItem from '../components/TransactionItem';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { transactions, isLoading, removeTransaction } = useWallet();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(), []);

  useEffect(() => {
    if (!isLoading) {
      console.log(`[Ramfin] Beranda: ${transactions.length} transaksi`);
    }
  }, [isLoading, transactions.length]);

  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.screenAccentBg }]}>
      <BalanceHeader />
      <View style={[styles.sheet, { backgroundColor: colors.sheetBg }]}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaksi Terbaru</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transaksi')}>
            <Text style={[styles.link, { color: colors.primary }]}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.emptyCircle }]}>
              <Ionicons name="wallet-outline" size={44} color={colors.emptyIcon} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textMuted }]}>Belum ada transaksi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tambah')}>
              <Text style={[styles.emptyLink, { color: colors.primary }]}>Tambah transaksi pertama</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listPad}>
            {recent.map((item) => (
              <TransactionItem key={item.id} item={item} onDelete={removeTransaction} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    sheet: {
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -12,
      paddingTop: 20,
      overflow: 'hidden',
    },
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '800',
    },
    link: {
      fontWeight: '700',
      fontSize: 14,
    },
    listPad: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingBottom: 80,
    },
    emptyIcon: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
    },
    emptyLink: {
      fontWeight: '800',
      fontSize: 15,
    },
  });

export default HomeScreen;
