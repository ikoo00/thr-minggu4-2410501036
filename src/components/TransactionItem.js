import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const formatRp = (n) => `Rp ${Math.round(n || 0).toLocaleString('id-ID')}`;

const formatDateLabel = (date) => {
  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '-';
  }
};

const TransactionItem = ({ item, onDelete }) => {
  const { colors } = useTheme();
  const isIncome = item.type === 'pemasukan';
  const styles = useMemo(() => createStyles(), []);

  const subtitle = isIncome
    ? [item.from ? `Dari: ${item.from}` : null, item.description].filter(Boolean).join(' • ')
    : [`Kategori: ${item.category || '-'}`, item.description].filter(Boolean).join(' • ');

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.sheetBg, borderColor: colors.border },
      ]}
    >
      <View style={styles.top}>
        <View style={styles.left}>
          <View
            style={[
              styles.badge,
              { backgroundColor: isIncome ? colors.badgeIncomeBg : colors.badgeExpenseBg },
            ]}
          >
            <Ionicons
              name={isIncome ? 'trending-up' : 'trending-down'}
              size={14}
              color={isIncome ? colors.primary : colors.expenseIcon}
            />
            <Text
              style={[
                styles.badgeText,
                { color: isIncome ? colors.primary : colors.expenseIcon },
              ]}
            >
              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </Text>
          </View>
          <Text style={[styles.amount, { color: colors.text }]}>{formatRp(item.amount)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: colors.deleteBtnBg }]}
          onPress={() => onDelete(item.id)}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={20} color={colors.expenseIcon} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
        {subtitle}
      </Text>
      <Text style={[styles.date, { color: colors.textMuted }]}>{formatDateLabel(item.date)}</Text>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
    },
    top: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    left: {
      flex: 1,
      paddingRight: 8,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '700',
      marginLeft: 6,
    },
    amount: {
      fontSize: 18,
      fontWeight: '800',
      marginTop: 8,
    },
    desc: {
      marginTop: 8,
      fontSize: 14,
    },
    date: {
      marginTop: 6,
      fontSize: 12,
    },
    deleteBtn: {
      padding: 6,
      borderRadius: 10,
    },
  });

export default TransactionItem;
