# AGENTS.md — GoHaur Frontend

Panduan untuk AI agent / developer yang mengerjakan aplikasi React Native ini.

## Ringkasan

Aplikasi mobile GoHaur (React Native 0.78, React 19, JavaScript).
Tiga peran pengguna: `buyer`, `seller`, `courier`. Navigasi dipisah per role.

## Perintah Penting

```bash
npm install
npm start                # Metro bundler
npm run android          # build + jalankan di emulator/device
npm run ios              # hanya macOS
npm run lint             # ESLint
npm run format           # Prettier
npm test                 # Jest
npm run verify           # lint + test
```

Backend harus jalan lebih dulu di port `3000`.

## Peta Folder

```text
src/App.js                 # root komponen
src/api/config.js          # BASE_URL backend (10.0.2.2 untuk emulator Android)
src/api/apiClient.js       # axios + interceptor token JWT
src/api/services/          # satu file per domain: auth, store, product, order, delivery, feedback, profile
src/context/               # AuthContext, CartContext
src/navigation/            # root-navigator + navigator per role
src/screens/               # seluruh layar UI
src/hooks/                 # hook bersama (useProfileData)
src/utils/                 # tokenStorage, logger
src/constants/styles.js    # font & warna
```

## Aturan yang Wajib Diikuti

1. Screen tidak boleh memanggil `axios` langsung. Selalu lewat `src/api/services/*`.
2. Semua komunikasi HTTP memakai `apiClient` supaya token otomatis terpasang.
3. Jangan memakai `console.*` di kode aplikasi. Pakai `logger` dari `src/utils/logger.js`
   agar log mati di production.
4. Hook harus dipanggil sebelum early return apa pun. Jangan panggil hook di dalam
   `if`/loop.
5. `useEffect` yang memanggil fungsi lokal: bungkus fungsi dengan `useCallback` dan
   masukkan ke dependency array.
6. State global auth hanya lewat `AuthContext`; jangan baca/tulis token langsung dari screen.
7. Navigasi mengikuti role di `root-navigator.js`. Jangan tambahkan bypass development.
8. Jangan menyimpan file bernama `* copy.js` atau kode mati lain.

## Catatan Teknis

- Emulator Android mengakses host lewat `http://10.0.2.2:3000`.
  Perangkat fisik memakai IP LAN, misal `http://192.168.1.10:3000`.
  Ubah di `src/api/config.js`.
- Jest memakai mock untuk Reanimated, AsyncStorage, dan safe-area-context
  (lihat `jest.setup.js`).
- Font Poppins ada di `assets/fonts/Poppins` dan didaftarkan via `react-native.config.js`
  (`npx react-native-asset` setelah menambah font).

## Definition of Done

`npm run verify` hijau, `npx react-native bundle --platform android --dev false --entry-file index.js`
berhasil, dan alur role yang disentuh sudah dicoba manual di emulator.
