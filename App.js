import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RamfinProvider } from './src/context/RamfinContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import StatsScreen from './src/screens/StatsScreen';

const Tab = createBottomTabNavigator();

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, focused }) => {
          const iconSize = focused ? 24 : 22;
          let iconName = 'home-outline';
          if (route.name === 'Beranda') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Transaksi') iconName = focused ? 'list' : 'list-outline';
          if (route.name === 'Tambah') iconName = focused ? 'add-circle' : 'add-circle-outline';
          if (route.name === 'Statistik') iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Transaksi" component={TransactionsScreen} />
      <Tab.Screen name="Tambah" component={AddTransactionScreen} options={{ tabBarLabel: 'Tambah' }} />
      <Tab.Screen name="Statistik" component={StatsScreen} />
    </Tab.Navigator>
  );
}

function ThemedNavigationRoot() {
  const { colors, isDark } = useTheme();

  const navigationTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: colors.primary,
        background: colors.background,
        card: colors.tabBarBg,
        text: colors.text,
        border: colors.border,
        notification: colors.primary,
      },
    }),
    [isDark, colors]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['bottom']}>
        <NavigationContainer theme={navigationTheme}>
          <MainTabs />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <RamfinProvider>
      <ThemeProvider>
        <ThemedNavigationRoot />
      </ThemeProvider>
    </RamfinProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
