import React, {createContext, useState, useEffect, useContext} from 'react';
import {getToken, getUserData} from '../utils/tokenStorage';
import {authService} from '../api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek token saat aplikasi dimulai
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await getToken();
        const userData = await getUserData();

        if (storedToken && userData) {
          setToken(storedToken);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Fungsi login
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

  // Fungsi register
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

  // Fungsi logout
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
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
