import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const GA_TRACKING_ID = publicRuntimeConfig.GA_TRACKING_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = ({ title, url, path }) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_title: title,
    page_location: url,
    page_path: path
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};
