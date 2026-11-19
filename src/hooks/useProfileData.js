import {useCallback, useEffect, useRef, useState} from 'react';
import {profileService} from '../api';

/**
 * Mengambil data profil user yang sedang login.
 *
 * Dipakai oleh layar profil buyer, seller, dan courier supaya logika
 * fetch + loading + penanganan error tidak ditulis ulang di tiap layar.
 *
 * @param {Object} options
 * @param {(error: any) => void} [options.onError] - dipanggil saat fetch gagal.
 * @returns {{userData: any, isLoading: boolean, error: any, refetch: () => Promise<any>}}
 */
export default function useProfileData({onError} = {}) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simpan callback di ref supaya identitasnya tidak memicu fetch ulang.
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileService.getProfile();
      const user = response.data?.user ?? null;
      setUserData(user);
      return user;
    } catch (err) {
      setError(err);
      onErrorRef.current?.(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {userData, isLoading, error, refetch: fetchProfileData};
}
