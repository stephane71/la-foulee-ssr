import Geohash, { GEOHASH_PRECISION } from '../utils/geohash';

export default function getUserLocation() {
  return new Promise((resolve, reject) => {
    // TODO: fallback if error or timeout
    navigator.geolocation.getCurrentPosition(
      position => {
        const geohash = Geohash.encode(
          position.coords.latitude,
          position.coords.longitude,
          GEOHASH_PRECISION
        );
        resolve(geohash);
      },
      error => {
        console.error(error);
        reject(error);
      }
    );
  });
}
