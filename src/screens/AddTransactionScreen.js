import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useWallet from '../hooks/useWallet';
import { useTheme } from '../context/ThemeContext';
import TransactionForm from '../components/TransactionForm';

const AddTransactionScreen = () => {
  const { addIncome, addExpense } = useWallet();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(), []);

  const handleSave = (payload) => {
    if (payload.type === 'pemasukan') {
      addIncome({
        amount: payload.amount,
        description: payload.description,
        from: payload.from,
        date: payload.date,
      });
    } else {
      addExpense({
        amount: payload.amount,
        description: payload.description,
        category: payload.category,
        date: payload.date,
      });
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.inner}>
        <TransactionForm onSave={handleSave} />
      </View>
    </SafeAreaView>
  );
};

const createStyles = () =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    inner: {
      flex: 1,
    },
  });

export default AddTransactionScreen;
