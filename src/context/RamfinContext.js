import React, { createContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ramfin_transactions_v2';
const LEGACY_STORAGE_KEYS = ['@thr_manager_transactions_v2', '@thr_transactions'];

export const ACTIONS = {
  SET_INITIAL_DATA: 'SET_INITIAL_DATA',
  ADD_INCOME: 'ADD_INCOME',
  ADD_EXPENSE: 'ADD_EXPENSE',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_ERROR: 'SET_ERROR',
};

const initialState = {
  transactions: [],
  isLoading: true,
  error: null,
};

const ramfinReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_INITIAL_DATA:
      return {
        ...state,
        transactions: Array.isArray(action.payload) ? action.payload : [],
        isLoading: false,
        error: null,
      };
    case ACTIONS.ADD_INCOME:
    case ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const RamfinContext = createContext(null);

export const RamfinProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ramfinReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        let raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          for (const key of LEGACY_STORAGE_KEYS) {
            raw = await AsyncStorage.getItem(key);
            if (raw) break;
          }
        }
        if (raw) {
          const parsed = JSON.parse(raw);
          const normalized = Array.isArray(parsed)
            ? parsed.map((t) => ({
                ...t,
                description:
                  t.description ||
                  (t.type === 'pemasukan'
                    ? `Pemasukan${t.from ? ` dari ${t.from}` : ''}`
                    : `Pengeluaran${t.category ? ` (${t.category})` : ''}`),
              }))
            : [];
          dispatch({ type: ACTIONS.SET_INITIAL_DATA, payload: normalized });
        } else {
          dispatch({ type: ACTIONS.SET_INITIAL_DATA, payload: [] });
        }
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error });
        dispatch({ type: ACTIONS.SET_INITIAL_DATA, payload: [] });
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions)).catch((err) => {
        console.warn('Gagal menyimpan transaksi', err);
      });
    }
  }, [state.transactions, state.isLoading]);

  const addIncome = useCallback(({ amount, description, from, date }) => {
    const newTransaction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'pemasukan',
      amount: Number(amount),
      description: String(description || '').trim(),
      from: from != null ? String(from).trim() : '',
      date,
    };
    dispatch({ type: ACTIONS.ADD_INCOME, payload: newTransaction });
  }, []);

  const addExpense = useCallback(({ amount, description, category, date }) => {
    const newTransaction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'pengeluaran',
      amount: Number(amount),
      description: String(description || '').trim(),
      category: String(category || '').trim(),
      date,
    };
    dispatch({ type: ACTIONS.ADD_EXPENSE, payload: newTransaction });
  }, []);

  const removeTransaction = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  }, []);

  const value = useMemo(
    () => ({
      transactions: state.transactions,
      isLoading: state.isLoading,
      error: state.error,
      addIncome,
      addExpense,
      removeTransaction,
    }),
    [state.transactions, state.isLoading, state.error, addIncome, addExpense, removeTransaction]
  );

  return <RamfinContext.Provider value={value}>{children}</RamfinContext.Provider>;
};

export default RamfinContext;
