const EARTH_RADIUS_KM = 6371;

/** Jarak garis lurus dua titik (Haversine), hasil km. */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = value => (Number(value) * Math.PI) / 180;
  const dLat = toRad(lat2) - toRad(lat1);
  const dLon = toRad(lon2) - toRad(lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Samakan dengan backend. */
export const MAX_DELIVERY_DISTANCE_KM = 5;
export const PACKAGING_FEE = 2000;

export const SHIPPING_TIERS = [
  { maxKm: 1, cost: 8000 },
  { maxKm: 2, cost: 10000 },
  { maxKm: 3, cost: 12500 },
  { maxKm: 4, cost: 15000 },
  { maxKm: 5, cost: 18000 },
];

export function roundDistanceKm(value) {
  return Math.round(Number(value) * 100) / 100;
}

export function getShippingCost(distanceKm) {
  const km = roundDistanceKm(distanceKm);
  const tier = SHIPPING_TIERS.find(item => km < item.maxKm);
  return tier ? tier.cost : null;
}

export function formatRupiah(value) {
  return `Rp ${Math.round(Number(value) || 0).toLocaleString('id-ID')}`;
}

export function formatDistance(distanceKm) {
  if (distanceKm == null || Number.isNaN(distanceKm)) {
    return '-';
  }
  return `${Number(distanceKm).toFixed(1)} km`;
}
