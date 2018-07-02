import {
  UNKNOWN_ERROR,
  PERMISSION_DENIED,
  POSITION_UNAVAILABLE,
  TIMEOUT
} from '../enums';

const POSITION_ERRORS = [
  { code: 0, value: UNKNOWN_ERROR },
  { code: 1, value: PERMISSION_DENIED },
  { code: 2, value: POSITION_UNAVAILABLE },
  { code: 3, value: TIMEOUT }
];

export default function getUserLocation() {
  return new Promise((resolve, reject) => {
    // TODO: fallback if error or timeout
    navigator.geolocation.getCurrentPosition(
      position =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
      error => {
        const positionError = POSITION_ERRORS.find(
          ({ code }) => error.code === code
        );
        reject(positionError.value);
      }
    );
  });
}
