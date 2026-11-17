/**
 * Logger sederhana.
 *
 * Saat development (__DEV__ true) semua log tampil di console.
 * Saat production, log dimatikan agar tidak membocorkan data ke pengguna
 * dan tidak memperlambat aplikasi.
 */
const noop = () => {};

const logger = __DEV__
  ? {
      log: (...args) => console.log(...args),
      info: (...args) => console.info(...args),
      warn: (...args) => console.warn(...args),
      error: (...args) => console.error(...args),
    }
  : {
      log: noop,
      info: noop,
      warn: noop,
      error: noop,
    };

export default logger;
