import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const GOOGLE_PLACES_API_KEY = publicRuntimeConfig.GOOGLE_PLACES_API_KEY;

export const MOBILE_STATIC_MAP = {
  width: 300,
  height: 100
};

export const DESKTOP_STATIC_MAP = {
  width: 300,
  height: 350
};

const mobileSize = `${MOBILE_STATIC_MAP.width}x${MOBILE_STATIC_MAP.height}`;
const desktopSize = `${DESKTOP_STATIC_MAP.width}x${DESKTOP_STATIC_MAP.height}`;

const BASE_URL = `https://maps.googleapis.com/maps/api/staticmap?key=${GOOGLE_PLACES_API_KEY}`;
const zoom = 12;

function buildGoogleMapStaticImage({ city, department }, desktop) {
  const size = desktop ? desktopSize : mobileSize;

  return `${BASE_URL}&size=${size}&zoom=${zoom}&center=${encodeURIComponent(
    city
  )},${department.isoCode}`;
}

export default buildGoogleMapStaticImage;
