/* eslint-env jest */
/* Setup global untuk Jest (React Native). */

// Beberapa modul React Native memanggil window.dispatchEvent saat cleanup.
if (typeof global.window === 'undefined') {
  global.window = global;
}
if (typeof global.window.dispatchEvent !== 'function') {
  global.window.dispatchEvent = () => {};
}

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(success =>
    success({coords: {latitude: -6.893, longitude: 107.616}}),
  ),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  setRNConfiguration: jest.fn(),
  requestAuthorization: jest.fn(() => Promise.resolve('granted')),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    WebView: React.forwardRef((props, ref) =>
      React.createElement(View, {...props, ref}),
    ),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insets = {top: 0, right: 0, bottom: 0, left: 0};
  const frame = {x: 0, y: 0, width: 390, height: 844};

  const SafeAreaInsetsContext = React.createContext(insets);
  const SafeAreaFrameContext = React.createContext(frame);

  return {
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: ({children}) => children,
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: {insets, frame},
  };
});
