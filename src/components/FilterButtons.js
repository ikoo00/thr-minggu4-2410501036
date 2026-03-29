import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const FilterButtons = ({ filter, onFilterChange }) => {
  const { colors } = useTheme();

  const items = [
    { key: 'semua', label: 'Semua' },
    { key: 'pemasukan', label: 'Masuk' },
    { key: 'pengeluaran', label: 'Keluar' },
  ];

  return (
    <View style={styles.row}>
      {items.map(({ key, label }) => {
        const active = filter === key;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.btn,
              { backgroundColor: colors.filterIdleBg, marginHorizontal: 4 },
              active && { backgroundColor: colors.filterActiveBg },
            ]}
            onPress={() => onFilterChange(key)}
          >
            <Text
              style={[
                styles.labelBase,
                { color: colors.filterLabel },
                active && { color: colors.filterLabelActive },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 0,
    gap: 8,
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBase: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default FilterButtons;
