# Ramfin (Ramadan Finance) - THR Minggu 4 State Management

## Informasi Mahasiswa

- Nama : [Muhamad Zidan Rabani]
- NIM : [2410501036]
- Opsi : B - Ramfin (Ramadan Finance)

## Deskripsi Aplikasi

**Ramfin** (**Ramadan Finance**) adalah aplikasi mobile (Expo + React Native) untuk mencatat **pemasukan** (sumber, jumlah, tanggal, keterangan) dan **pengeluaran** Ramadan (kategori seperti belanja, sedekah, investasi, dll.; jumlah, tanggal, keterangan). Data disimpan **lokal** dengan **AsyncStorage**. State keuangan global dikelola lewat **Context API** dan **useReducer** (`RamfinContext`). **Tema terang/gelap** dikelola terpisah lewat **`ThemeContext`** (palet warna + toggle), juga **dipersist** ke AsyncStorage. Pengguna dapat melihat **ringkasan saldo**, **filter transaksi**, dan **statistik** pengeluaran per kategori; **mode gelap** diaktifkan dari **switch di kanan atas Beranda** (sebelah judul Ramfin).

## Hooks yang Digunakan

### useState

Dipakai di beberapa komponen untuk state lokal, misalnya:

- **`TransactionForm.js`**: tab pemasukan/pengeluaran, teks jumlah, keterangan, field “dari” / kategori, tanggal (`DD/MM/YYYY`).
- **`TransactionsScreen.js`**: filter aktif (`semua` / `pemasukan` / `pengeluaran`).
- **`StatsScreen.js`**: tampilan daftar “Pengeluaran per kategori” dilipat / dibuka.

### useEffect

- **`RamfinContext.js`**: memuat transaksi dari **AsyncStorage** saat aplikasi dibuka; menyimpan ulang daftar transaksi ke storage saat data berubah (setelah selesai loading awal).
- **`ThemeContext.js`**: memuat preferensi tema (`light` / `dark`) dari AsyncStorage; menyimpan ulang saat pengguna mengganti **Mode gelap**.

### useReducer

Di **`RamfinContext.js`**, reducer memproses minimal tipe aksi berikut:

- `SET_INITIAL_DATA` — mengisi state awal transaksi dari storage (atau array kosong).
- `ADD_INCOME` — menambah transaksi pemasukan.
- `ADD_EXPENSE` — menambah transaksi pengeluaran.
- `DELETE_TRANSACTION` — menghapus transaksi berdasarkan `id`.
- `SET_ERROR` — menyimpan error saat gagal load/parse data.

### Custom Hook

- **`useWallet()`** (`src/hooks/useWallet.js`): membaca **Context** keuangan, menghitung **`totalSaldo`**, **`totalMasuk`**, **`totalKeluar`**, dan mengekspos **`addIncome`**, **`addExpense`**, **`removeTransaction`**. Hook ini dipakai berulang di beberapa layar/komponen (misalnya ringkasan saldo, daftar transaksi, form tambah, statistik).

### Context tambahan (tema)

- **`ThemeContext.js`**: **`ThemeProvider`**, **`useTheme()`** — menyediakan objek **`colors`**, **`isDark`**, **`toggleTheme`**, **`setDarkMode`**. Komponen dan layar membaca warna dari sini agar **dark mode** konsisten.

## Screenshot

1. **Beranda**
   <img src ="assests/ss 1.jpeg">

2. **Transaksi**
   <img src ="assests/ss 2.jpeg">

3. **Tambah**
   <img src ="assests/ss 3.jpeg">

4. **Statistik**
   <img src ="assests/ss 4.jpeg">

## Cara Menjalankan

```bash
npm install && npx expo start
```

