import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const GOOGLE_PLACES_API_KEY = publicRuntimeConfig.GOOGLE_PLACES_API_KEY;

const BASE_URL_GOOGLE_PHOTO =
  "https://maps.googleapis.com/maps/api/place/photo";
const MAX_WIDTH_CITY_PHOTO = 800;
const MAX_HEIGHT_CITY_PHOTO = 400;

export default function(place) {
  if (!place || !place.photos || !place.photos.length) return null;

  const photo = place.photos[0];

  return `${BASE_URL_GOOGLE_PHOTO}?photoreference=${
    photo.photo_reference
  }&key=${GOOGLE_PLACES_API_KEY}&maxheight=${MAX_HEIGHT_CITY_PHOTO}&maxwidth=${MAX_WIDTH_CITY_PHOTO}`;
}
