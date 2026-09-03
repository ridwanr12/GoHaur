# Panduan Pengembang (Developer Guide) GoHaur Frontend

Selamat datang di kode sumber (source code) aplikasi **GoHaur**! Dokumen ini dirancang untuk membantu pengembang baru (atau untuk keperluan pembelajaran/skripsi) memahami arsitektur, pola kode (code patterns), dan alur data dalam aplikasi React Native ini.

---

## 1. Arsitektur Folder & Struktur Proyek

Aplikasi ini menggunakan pola arsitektur berbasis fitur sederhana namun terstruktur, agar mudah diperluas dan di-maintenance. Semua kode utama aplikasi diletakkan di dalam folder `/src`.

Berikut adalah struktur folder utama:

```text
src/
├── api/             # Mengatur semua komunikasi dengan server (backend)
│   ├── services/    # Kumpulan file yang secara spesifik memanggil endpoint (store, product, order)
│   ├── apiClient.js # Konfigurasi utama axios (termasuk interceptors untuk token)
│   └── config.js    # Konfigurasi URL server (BASE_URL)
├── constants/       # Tempat menyimpan nilai-nilai statis/konstanta global
│   └── styles.js    # Konfigurasi font atau styling global agar UI konsisten
├── context/         # Tempat menyimpan React Context untuk global state
│   └── AuthContext.js # Mengelola status login (user & token) dan men-supply state ke seluruh aplikasi
├── navigation/      # Mengatur perpindahan antar layar (routing)
│   ├── root-navigator.js # Entry point utama navigasi yang menentukan alur berdasarkan role pengguna
│   ├── auth-navigator.js # Stack untuk pengguna yang belum login (Signin, Signup)
│   ├── buyer-navigator.js # Stack khusus untuk peran pembeli
│   └── ...          # Navigator untuk peran lain (seller, courier)
├── screens/         # Kumpulan seluruh tampilan antarmuka (UI/Views)
│   ├── home.js      # Halaman utama
│   ├── store.js     # Halaman detail restoran
│   ├── cart.js      # Halaman keranjang dan pembayaran
│   └── ...
└── utils/           # Fungsi-fungsi bantuan (helper) yang bisa dipakai berulang kali
    └── tokenStorage.js # Logika untuk menyimpan, membaca, dan menghapus token dari AsyncStorage
```

---

## 2. Alur Data (Data Flow) & Koneksi Backend

Aplikasi GoHaur mengambil dan mengirim data dari backend melalui Restful API. Kami memisahkannya menjadi layer **Service**.

### Cara Kerja Layer API:
1. **apiClient.js**: File ini membuat satu *instance* dari pustaka `axios`. File ini secara otomatis akan menambahkan token JWT pada setiap permintaan (request) API yang dipanggil melalui header `Authorization`.
2. **Services (`api/services/`)**: File seperti `orderService.js` atau `storeService.js` tidak mengatur UI. Mereka murni berfungsi untuk memanggil `apiClient.get()` atau `apiClient.post()`. Tujuannya agar UI (Screen) lebih bersih.
3. **Screen (`screens/`)**: Halaman UI memanggil fungsi dari service tersebut di dalam blok `useEffect` (saat halaman pertama kali dimuat).

**Contoh Alur Sederhana di `home.js`:**
1. Pengguna membuka `HomeScreen`.
2. `useEffect` di dalam `home.js` memanggil `storeService.getAllStores()`.
3. `storeService` memanggil `apiClient.get('/api/stores')`.
4. Jika sukses, data dari server disematkan ke dalam variabel _state_ React lokal menggunakan `setStores(data)`.
5. Komponen `FlatList` merender data `stores` menjadi daftar toko di layar.

---

## 3. Alur Autentikasi dan Navigasi (Role-Based)

Salah satu fitur inti aplikasi ini adalah memberikan layar/fitur yang berbeda sesuai dengan jenis pengguna (*Buyer*, *Seller*, *Courier*).

- Saat pengguna menekan "Login" di `signin.js`, aplikasi memanggil API backend (`/api/auth/login`).
- Backend membalas dengan data `user` (termasuk *role*) dan `token`.
- Fungsi `login()` dari `AuthContext` menyimpan token ini secara lokal (AsyncStorage) dan merubah _state_ global.
- Secara reaktif, `RootNavigator` (`navigation/root-navigator.js`) mendeteksi perubahan state tersebut. Jika `user.role === 'buyer'`, ia langsung menampilkan `buyer-navigator.js`. Jika belum login, ia menampilkan `auth-navigator.js`.

---

## 4. Panduan Membaca Kode (React Hooks)

Saat membaca file-file `.js` di dalam folder `src/screens`, Anda akan banyak menemukan dua React Hooks utama:

- `useState`: Digunakan untuk menyimpan data secara lokal dalam komponen. Jika variabel ini berubah nilainya menggunakan fungsi *setter* (misal: `setLoading(false)`), UI di layar akan diperbarui secara otomatis.
- `useEffect`: Digunakan untuk menjalankan "efek samping", biasanya digunakan untuk mengambil data (API *fetching*) di latar belakang saat sebuah komponen baru saja dirender di layar ponsel.

---

Semoga panduan singkat ini dapat memberikan gambaran komprehensif bagi Anda yang ingin mempelajari dan mengembangkan sistem di dalam GoHaur Frontend. 
Silakan lihat komentar (keterangan bahasa Indonesia) di dalam baris kode file inti (seperti `App.js`, `root-navigator.js`, `cart.js`, dll) untuk pembelajaran yang lebih terperinci.
