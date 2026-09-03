# GoHaur App (Frontend)

GoHaur adalah aplikasi pemesanan dan pengiriman makanan terintegrasi yang dibangun menggunakan **React Native**. Aplikasi ini memiliki sistem *Role-Based Access Control (RBAC)* yang memisahkan fitur untuk tiga jenis pengguna: **Pembeli (Buyer)**, **Penjual (Seller)**, dan **Kurir (Courier)**.

Aplikasi ini dikonfigurasi untuk terhubung dengan **GoHaur Backend** yang menyediakan RESTful API.

## Informasi Versi
- **Versi Aplikasi:** 0.0.1
- **React Native:** 0.78.1
- **React:** 19.0.0
- **Node.js:** >= 18.x.x

---

## Prasyarat (Prerequisites)

Sebelum mulai menjalankan aplikasi, pastikan komputer/laptop Anda telah terpasang:
1. **Node.js** (versi 18 ke atas) - Disarankan menggunakan versi LTS terbaru.
2. **npm** atau **Yarn** (paket manajer).
3. **Android Studio** beserta *Android SDK* (untuk menjalankan di Emulator Android).
4. **Xcode** (opsional, hanya untuk pengguna macOS yang ingin menjalankan di Simulator iOS).
5. Pastikan server **GoHaur Backend** Anda sudah menyala dan dapat diakses (misalnya di `http://localhost:5000` atau URL jaringan lokal seperti `http://192.168.x.x:5000`).

---

## Panduan Instalasi (Setup & Installation)

Ikuti langkah-langkah di bawah ini untuk mengatur dan menjalankan aplikasi secara lokal:

### 1. Kloning Repositori & Masuk ke Direktori
```bash
git clone <URL_REPOSITORI_ANDA>
cd GoHaur
```

### 2. Instalasi Dependensi (Package)
Jalankan perintah berikut untuk menginstal semua pustaka yang dibutuhkan (termasuk React Navigation, Axios, dan AsyncStorage):
```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Backend (API)
Secara default, aplikasi akan mengarahkan API ke `http://10.0.2.2:5000` (untuk Android Emulator) atau `http://localhost:5000` (untuk iOS Simulator). 
Buka file `src/api/config.js` dan pastikan `BASE_URL` mengarah ke IP Address Backend Anda yang aktif.

```javascript
// src/api/config.js
const API_CONFIG = {
  // Ganti dengan IP lokal Anda jika menguji di HP fisik, contoh: 'http://192.168.1.5:5000'
  BASE_URL: 'http://10.0.2.2:5000', 
  TIMEOUT: 10000,
};
```

---

## Menjalankan Aplikasi (Running the App)

### A. Menjalankan di Android
Pastikan *Android Emulator* Anda sudah berjalan, atau *Smartphone* Android Anda sudah terhubung ke PC dengan *USB Debugging* aktif.
```bash
npm run android
# atau
npx react-native run-android
```
*Catatan: Saat proses `build` gradle memakan waktu agak lama di percobaan pertama.*

### B. Menjalankan di iOS (Hanya macOS)
Jalankan instalasi `pod` terlebih dahulu sebelum *build*.
```bash
cd ios
pod install
cd ..
npm run ios
# atau
npx react-native run-ios
```

### C. Menjalankan Metro Bundler Saja
Jika Anda hanya ingin merestart Metro Bundler tanpa harus melakukan *rebuild* aplikasi, jalankan:
```bash
npm start
# atau
npm start -- --reset-cache
```

---

## Fitur Utama
- **Autentikasi Aman:** Sistem *login* dan *register* menggunakan token JWT.
- **Role-Based UI:** Tampilan yang berbeda dan terisolasi antara *Pembeli*, *Penjual*, dan *Kurir*.
- **Integrasi Penuh:** Katalog restoran, produk, transaksi, dan histori pesanan terkoneksi langsung (real-time) dengan API backend.

## Dokumentasi Lanjutan
Untuk mempelajari bagaimana struktur kode aplikasi ini ditulis dan bagaimana alur navigasi serta manajemen statenya bekerja, silakan baca [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) yang berada di *root folder* repositori ini.

---
*Dibuat untuk kebutuhan Skripsi/Pengembangan GoHaur.*
