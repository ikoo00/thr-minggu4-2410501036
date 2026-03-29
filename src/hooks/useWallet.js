import { useContext, useMemo } from 'react';
import RamfinContext from '../context/RamfinContext';

const useWallet = () => {
  const context = useContext(RamfinContext);
  if (!context) {
    throw new Error('useWallet harus dipakai di dalam RamfinProvider');
  }

  const { transactions, isLoading, error, addIncome, addExpense, removeTransaction } = context;

  const { totalSaldo, totalMasuk, totalKeluar } = useMemo(() => {
    let masuk = 0;
    let keluar = 0;
    for (const t of transactions) {
      if (t.type === 'pemasukan') masuk += Number(t.amount) || 0;
      else if (t.type === 'pengeluaran') keluar += Number(t.amount) || 0;
    }
    return {
      totalMasuk: masuk,
      totalKeluar: keluar,
      totalSaldo: masuk - keluar,
    };
  }, [transactions]);

  return {
    transactions,
    isLoading,
    error,
    totalSaldo,
    totalMasuk,
    totalKeluar,
    addIncome,
    addExpense,
    removeTransaction,
  };
};

export default useWallet;
