const REQ_PLACE_OK = 'OK';
const MAX_WIDTH = 800;
const MAX_HEIGHT = 400;
const BASE_URL_GOOGLE_PHOTO =
  'https://maps.googleapis.com/maps/api/place/photo';

function getUrl(ref) {
  return `${BASE_URL_GOOGLE_PHOTO}?photoreference=${ref}&key=${
    process.env.SERVER_GOOGLE_PLACES_API_KEY
  }&maxheight=${MAX_WIDTH}&maxwidth=${MAX_HEIGHT}`;
}

module.exports = function({ place_id }) {
  // WARNING: see https://arunoda.me/blog/ssr-and-server-only-modules
  const GoogleMaps = eval("require('@google/maps')");

  const googleMapsClient = GoogleMaps.createClient({
    key: process.env.SERVER_GOOGLE_PLACES_API_KEY,
    Promise: Promise
  });

  return googleMapsClient
    .place({
      placeid: place_id,
      sessiontoken: ''
    })
    .asPromise()
    .then(data => (data.json.status === REQ_PLACE_OK ? data.json.result : null))
    .then(data => {
      if (data.photos)
        data.photos = data.photos.map(({ photo_reference, ...photo }) => ({
          ...photo,
          photo_url: getUrl(photo_reference)
        }));

      return data;
    });
};
