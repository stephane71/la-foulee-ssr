import moment from 'moment-timezone';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;
const APP_URL = publicRuntimeConfig.APP_URL;
const DATE_FORMAT = 'YYYY-MM-DD';

export const getWebApplicationStructuredData = function() {
  const jsonLD = {
    '@context': 'http://schema.org',
    '@type': 'WebApplication',
    name: 'La Foulée',
    browserRequirements: 'requires javascript support',
    applicationCategory: 'Sport, Event',
    url: APP_URL,
    image: `${ASSETS_URL}/android-chrome-192x192.png`,
    operatingSystem: 'any'
  };

  return JSON.stringify(jsonLD);
};

export const getOrganizationStructuredData = function() {
  const jsonLD = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    legalName: 'La Foulée',
    description: `La Foulée facilite l'accès au événements sportifs. Les organisateurs bénéficient d'une fiche dédié à leurs evénements et du référencement sur les moteurs de recherche. Les sportifs profitent d'une plateforme qui leurs permets parcourir l'ensemble des événements.`,
    url: APP_URL,
    logo: `${ASSETS_URL}/android-chrome-192x192.png`,
    sameAs: ['https://twitter.com/_LaFoulee']
  };
  return JSON.stringify(jsonLD);
};

export const getEventListStructuredData = function(events) {
  const jsonLD = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    itemListElement: events.map(({ keyword }, i) => ({
      '@type': 'ListItem',
      position: i,
      url: `${APP_URL}/event/${keyword}`
    }))
  };

  return JSON.stringify(jsonLD);
};

export const getEventStructuredData = function(event, { description, path }) {
  const url = `${APP_URL}${path}`;
  const startDate = moment
    .unix(event.date)
    .utc()
    .format(DATE_FORMAT);
  const location = {
    '@type': 'Place',
    name: event.city,
    address: {
      '@type': 'PostalAddress',
      addressLocality: event.city,
      postalCode: event.department.code,
      addressCountry: 'FR'
    }
  };

  let jsonLD = {
    '@context': 'http://schema.org',
    '@type': 'Event',
    url,
    name: event.title,
    startDate,
    description: description,
    location
  };

  if (event.activities) {
    jsonLD = {
      ...jsonLD,
      subEvents: getEventActivitiesStructuredData(event.activities, {
        location,
        startDate,
        url
      })
    };
  }

  return JSON.stringify(jsonLD);
};

export const getEventActivitiesStructuredData = function(
  activities,
  { location, startDate, url }
) {
  return activities.map(({ distance, info, price, time, title }) => {
    let dateFormat = DATE_FORMAT;
    let start = startDate;
    let timeSplit = time.split(' ');

    if (time) {
      let departureTime = timeSplit[timeSplit.length === 1 ? 0 : 1];
      start = `${start} ${departureTime}`;
      dateFormat = `${dateFormat} HH:mm`;
    }

    return {
      '@context': 'http://schema.org',
      '@type': 'Event',
      url,
      name: title,
      // WARNING: hard coded Time Zone !
      startDate: moment.tz(start, dateFormat, 'America/Toronto').format(),
      location,
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'EUR'
      }
    };
  });
};
