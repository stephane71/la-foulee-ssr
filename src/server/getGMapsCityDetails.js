const { GM_PLACES_DETAILS_FIELDS } = require("../sharedEnums");

const REQ_PLACE_OK = "OK";
const BASE_URL_GOOGLE_PHOTO =
  "https://maps.googleapis.com/maps/api/place/photo";

function getUrl(ref, { maxWidth, maxHeight }) {
  return `${BASE_URL_GOOGLE_PHOTO}?photoreference=${ref}&key=${
    process.env.SERVER_GOOGLE_PLACES_API_KEY
  }&maxheight=${maxHeight}&maxwidth=${maxWidth}`;
}

module.exports = function(
  { place_id },
  { maxWidth, maxHeight },
  sessionToken = ""
) {
  // WARNING: see https://arunoda.me/blog/ssr-and-server-only-modules
  const GoogleMaps = eval("require('@google/maps')");

  const googleMapsClient = GoogleMaps.createClient({
    key: process.env.SERVER_GOOGLE_PLACES_API_KEY,
    Promise: Promise
  });

  return googleMapsClient
    .place({
      placeid: place_id,
      fields: GM_PLACES_DETAILS_FIELDS,
      sessiontoken: sessionToken
    })
    .asPromise()
    .then(data => (data.json.status === REQ_PLACE_OK ? data.json.result : null))
    .then(data => {
      if (data.photos)
        data.photos = data.photos.map(({ photo_reference, ...photo }) => ({
          ...photo,
          photo_url: getUrl(photo_reference, { maxWidth, maxHeight })
        }));

      const { geometry, ...rest } = data;
      return {
        location: { lat: geometry.location.lat, lng: geometry.location.lng },
        ...rest
      };
    });
};
