/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../src/App';

test('renders correctly', async () => {
  jest.useFakeTimers();

  let tree;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });

  // Jalankan timer yang tertunda (misal timer splash screen) supaya tidak
  // ada pekerjaan async yang berjalan setelah environment Jest selesai.
  await ReactTestRenderer.act(async () => {
    jest.runOnlyPendingTimers();
  });

  await ReactTestRenderer.act(async () => {
    tree.unmount();
  });

  jest.useRealTimers();
});
