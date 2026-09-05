import React, {createContext, useState, useEffect, useContext} from 'react';
import {getToken, getUserData} from '../utils/tokenStorage';
import {authService} from '../api';

// Membuat objek Context. Context memungkinkan kita melempar data (state)
// ke seluruh penjuru aplikasi tanpa harus melempar props (props drilling) satu per satu.
const AuthContext = createContext();

/**
 * AuthProvider adalah komponen "pembungkus" yang akan mengelola state login.
 * State ini (user, token) akan disuplai ke semua komponen anak ({children}).
 */
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null); // Menyimpan objek profil user (termasuk role)
  const [token, setToken] = useState(null); // Menyimpan token JWT
  const [isLoading, setIsLoading] = useState(true); // Loading awal ketika mengecek AsyncStorage

  // useEffect ini berjalan SATU KALI saat aplikasi baru saja dibuka.
  // Tugasnya: mengecek apakah di penyimpanan HP (AsyncStorage) sudah ada token login sebelumnya.
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await getToken();
        const userData = await getUserData();

        if (storedToken && userData) {
          // Jika sudah ada, langsung masukkan ke state. Aplikasi akan otomatis masuk ke Home.
          setToken(storedToken);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false); // Selesai mengecek
      }
    };

    loadStoredData();
  }, []);

  /**
   * Fungsi untuk memproses login.
   * Akan memanggil authService.login() yang mengirim request ke backend.
   * Jika sukses, token dan data user akan diset ke state global.
   */
  const login = async credentials => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user || {});
      setToken(response.data.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Fungsi untuk memproses registrasi.
   */
  const register = async userData => {
    try {
      const response = await authService.register(userData);
      if (response.data.token) {
        setUser(response.data.user || {});
        setToken(response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Fungsi untuk keluar dari aplikasi (logout).
   * Akan memanggil backend (jika perlu) dan menghapus state `user` serta `token`.
   * Saat state ini menjadi null, RootNavigator otomatis akan mengembalikan pengguna ke AuthNavigator (layar login).
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  return (
    // Memasukkan state dan fungsi ke dalam Provider agar dapat diakses dari komponen mana saja
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token, // akan true jika token ada isinya
        isLoading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook untuk memudahkan komponen lain memakai AuthContext.
// Cara pakai di file lain: const { user, login } = useAuth();
export const useAuth = () => useContext(AuthContext);
