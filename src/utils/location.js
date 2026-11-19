import Geolocation from '@react-native-community/geolocation';

/**
 * Ambil koordinat GPS perangkat sekali pakai.
 *
 * @returns {Promise<{latitude:number, longitude:number}>}
 */
export function getCurrentCoordinates(timeout = 15000) {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout,
        maximumAge: 10000,
      },
    );
  });
}
