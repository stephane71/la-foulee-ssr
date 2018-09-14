import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const GOOGLE_PLACES_API_KEY = publicRuntimeConfig.GOOGLE_PLACES_API_KEY;

const BASE_URL = `https://maps.googleapis.com/maps/api/staticmap?key=${GOOGLE_PLACES_API_KEY}`;
const zoom = 12;

function buildGoogleMapStaticImage(
  { city, department },
  { width, height },
  desktop
) {
  const mobileSize = `${width}x${height}`;
  const desktopSize = `${width}x${height}`;

  const size = desktop ? desktopSize : mobileSize;

  return `${BASE_URL}&size=${size}&zoom=${zoom}&center=${encodeURIComponent(
    city
  )},${department.isoCode}`;
}

export default buildGoogleMapStaticImage;
