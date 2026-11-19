import {
  haversineDistanceKm,
  getShippingCost,
  MAX_DELIVERY_DISTANCE_KM,
} from '../src/utils/geo';

describe('haversineDistanceKm', () => {
  test('jarak titik yang sama adalah 0', () => {
    expect(haversineDistanceKm(-6.895, 107.618, -6.895, 107.618)).toBeCloseTo(0, 5);
  });

  test('Bandung ke Jakarta lebih dari 100 km', () => {
    const distance = haversineDistanceKm(-6.9175, 107.6191, -6.2088, 106.8456);
    expect(distance).toBeGreaterThan(100);
    expect(distance).toBeLessThan(140);
  });
});

describe('getShippingCost', () => {
  test.each([
    [0, 8000],
    [0.5, 8000],
    [1, 10000],
    [2.5, 12500],
    [3.5, 15000],
    [4.9, 18000],
  ])('jarak %s km -> %s', (distance, expected) => {
    expect(getShippingCost(distance)).toBe(expected);
  });

  test('5 km ke atas tidak dilayani', () => {
    expect(getShippingCost(MAX_DELIVERY_DISTANCE_KM)).toBeNull();
  });

  test('membulatkan jarak 2 desimal sebelum memilih tier', () => {
    expect(getShippingCost(0.994)).toBe(8000);
    expect(getShippingCost(1.004)).toBe(10000);
    expect(getShippingCost(4.999)).toBeNull();
  });
});
