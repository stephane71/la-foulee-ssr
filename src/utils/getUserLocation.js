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
        console.error(error);
        reject(error);
      }
    );
  });
}
