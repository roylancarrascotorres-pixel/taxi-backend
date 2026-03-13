export function validateArrival(
  driverLat: number,
  driverLng: number,
  clientLat: number,
  clientLng: number
): boolean {
  const distance = getDistance(driverLat, driverLng, clientLat, clientLng);
  return distance <= Number(process.env.GPS_TOLERANCE_METERS || 80);
}

// Validación para que solo funcione en La Habana
export function isInsideHavana(lat: number, lng: number): boolean {
  const havanaLat = Number(process.env.HAVANA_LAT);
  const havanaLng = Number(process.env.HAVANA_LNG);
  const cityRadius = Number(process.env.CITY_RADIUS_KM) * 1000;

  const distance = getDistance(lat, lng, havanaLat, havanaLng);
  return distance <= cityRadius;
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}