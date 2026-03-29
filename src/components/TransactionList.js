import React, { useMemo } from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import TransactionItem from './TransactionItem';

const TransactionList = ({
  transactions,
  onDelete,
  emptyText = 'Tidak ada transaksi',
  emptyIcon = 'funnel-outline',
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(), []);

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem item={item} onDelete={onDelete} />}
      ListEmptyComponent={() => (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.emptyCircle }]}>
            <Ionicons name={emptyIcon} size={40} color={colors.emptyIcon} />
          </View>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>{emptyText}</Text>
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const createStyles = () =>
  StyleSheet.create({
    listContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    emptyWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    emptyIconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 15,
      fontWeight: '600',
    },
  });

export default TransactionList;
