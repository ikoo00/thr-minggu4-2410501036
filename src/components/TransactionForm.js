import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const pad2 = (n) => String(n).padStart(2, '0');

const todayDDMMYYYY = () => {
  const d = new Date();
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

function parseDdMmYyyyToIso(s) {
  const parts = String(s).trim().split(/[\/\-]/);
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (!year || month < 0 || month > 11 || day < 1 || day > 31) return null;
  const dt = new Date(year, month, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month || dt.getDate() !== day) return null;
  return dt.toISOString();
}

function parseAmountInput(raw) {
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return NaN;
  return Number(digits);
}

const TransactionForm = ({ onSave }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(), []);

  const [tab, setTab] = useState('pemasukan');
  const [amountText, setAmountText] = useState('');
  const [description, setDescription] = useState('');
  const [from, setFrom] = useState('');
  const [category, setCategory] = useState('Belanja');
  const [dateText, setDateText] = useState(todayDDMMYYYY);

  const handleSave = () => {
    const amount = parseAmountInput(amountText);
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Error', 'Masukkan jumlah yang valid');
      return;
    }
    const desc = description.trim();
    if (!desc) {
      Alert.alert('Error', 'Keterangan wajib diisi');
      return;
    }
    const dateIso = parseDdMmYyyyToIso(dateText);
    if (!dateIso) {
      Alert.alert('Error', 'Format tanggal tidak valid (gunakan DD/MM/YYYY)');
      return;
    }

    if (tab === 'pemasukan') {
      onSave({
        type: 'pemasukan',
        amount,
        description: desc,
        from: from.trim(),
        date: dateIso,
      });
    } else {
      const cat = category.trim();
      if (!cat) {
        Alert.alert('Error', 'Kategori pengeluaran wajib diisi');
        return;
      }
      onSave({
        type: 'pengeluaran',
        amount,
        description: desc,
        category: cat,
        date: dateIso,
      });
    }

    setAmountText('');
    setDescription('');
    setFrom('');
    setCategory('Belanja');
    setDateText(todayDDMMYYYY());
    Alert.alert('Sukses', 'Transaksi berhasil disimpan');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.tabs, { backgroundColor: colors.segmentBg }]}>
          <TouchableOpacity
            style={[styles.tab, tab === 'pemasukan' && { backgroundColor: colors.primary }]}
            onPress={() => setTab('pemasukan')}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.tabTextInactive },
                tab === 'pemasukan' && styles.tabTextActive,
              ]}
            >
              Pemasukan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'pengeluaran' && { backgroundColor: colors.primary }]}
            onPress={() => setTab('pengeluaran')}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.tabTextInactive },
                tab === 'pengeluaran' && styles.tabTextActive,
              ]}
            >
              Pengeluaran
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: colors.text }]}>
          Jumlah (Rp) <Text style={[styles.required, { color: colors.danger }]}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.inputBg,
            },
          ]}
          value={amountText}
          onChangeText={setAmountText}
          placeholder="Rp 0"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Keterangan <Text style={[styles.required, { color: colors.danger }]}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.inputBg,
            },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder={tab === 'pemasukan' ? 'Contoh: dari perusahaan' : 'Mis. belanja kebutuhan lebaran'}
          placeholderTextColor={colors.placeholder}
        />

        {tab === 'pemasukan' ? (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Dari</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.inputBg,
                },
              ]}
              value={from}
              onChangeText={setFrom}
              placeholder="Nama pemberi (opsional)"
              placeholderTextColor={colors.placeholder}
            />
          </>
        ) : (
          <>
            <Text style={[styles.label, { color: colors.text }]}>
              Kategori <Text style={[styles.required, { color: colors.danger }]}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.inputBg,
                },
              ]}
              value={category}
              onChangeText={setCategory}
              placeholder="Belanja, sedekah, investasi, dll"
              placeholderTextColor={colors.placeholder}
            />
          </>
        )}

        <Text style={[styles.label, { color: colors.text }]}>
          Tanggal <Text style={[styles.required, { color: colors.danger }]}>*</Text>
        </Text>
        <View style={styles.dateRow}>
          <TextInput
            style={[
              styles.input,
              styles.dateInput,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.inputBg,
              },
            ]}
            value={dateText}
            onChangeText={setDateText}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.placeholder}
          />
          <Ionicons
            name="calendar-outline"
            size={22}
            color={colors.placeholder}
            style={styles.dateIcon}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text style={styles.saveBtnText}> Simpan Transaksi</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = () =>
  StyleSheet.create({
    scroll: {
      paddingHorizontal: 20,
      paddingBottom: 32,
      paddingTop: 8,
    },
    tabs: {
      flexDirection: 'row',
      borderRadius: 14,
      padding: 4,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    tabText: {
      fontSize: 14,
      fontWeight: '700',
    },
    tabTextActive: {
      color: '#fff',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    required: {},
    input: {
      width: '100%',
      minHeight: 50,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      marginBottom: 16,
    },
    dateRow: {
      position: 'relative',
      marginBottom: 8,
    },
    dateInput: {
      marginBottom: 0,
      paddingRight: 40,
    },
    dateIcon: {
      position: 'absolute',
      right: 14,
      top: 14,
    },
    saveBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 54,
      borderRadius: 14,
      marginTop: 8,
    },
    saveBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '800',
    },
  });

export default TransactionForm;
