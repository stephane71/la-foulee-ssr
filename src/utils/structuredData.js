import moment from 'moment-timezone';
import getConfig from 'next/config';

import formatDistance from '../utils/formatDistance';
import getEventDescription from '../utils/getEventDescription';

const { publicRuntimeConfig } = getConfig();
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;
const APP_URL = publicRuntimeConfig.APP_URL;
const DATE_FORMAT = 'YYYY-MM-DD';

const getDate = ts =>
  moment
    .unix(ts)
    .utc()
    .format(DATE_FORMAT);

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

  return jsonLD;
};

export const getOrganizationStructuredData = function() {
  const jsonLD = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    legalName: 'La Foulée',
    description: `La Foulée facilite l'accès aux événements de courses à pieds. Retrouvez le calendrier complet et les informations essentielles pour chaque évènement: liste des courses, heure de départ, prix, site de l'organisateur`,
    url: APP_URL,
    logo: `${ASSETS_URL}/android-chrome-192x192.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      areaServed: 'France',
      contactType: 'customer support',
      availableLanguage: ['French', 'English'],
      telephone: '+33662461643'
    },
    sameAs: [
      'https://twitter.com/_LaFoulee',
      'https://www.instagram.com/_lafoulee'
    ]
  };
  return jsonLD;
};

export const getEventListStructuredData = function(events) {
  const jsonLD = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    itemListElement: events.map(({ keyword, date }, i) => ({
      '@type': 'ListItem',
      position: i,
      url: `${APP_URL}/event/${keyword}/${moment.unix(date).year()}`
    }))
  };

  return jsonLD;
};

export const getEventStructuredData = function(event, { description, path }) {
  const url = `${APP_URL}${path}`;
  const startDate = getDate(event.date);
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
    description,
    location,
    startDate,
    endDate: event.endDate ? getDate(event.endDate) : startDate,
    name: event.title,
    eventStatus: 'EventScheduled'
    // image:
  };

  if (event.organisateur) {
    jsonLD = { ...jsonLD, organizer: getEventOrganizerStructuredData(event) };
  }

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

  return jsonLD;
};

const getEventOrganizerStructuredData = function({ organisateur, website }) {
  return {
    '@type': 'Organization',
    name: organisateur,
    url: website && website.length ? event.website[0] : ''
  };
};

const getEventActivitiesStructuredData = function(
  activities,
  { location, startDate, url }
) {
  return activities.map(({ distance, info, price, time, title }, i) => {
    if (time) {
      let timeSplit = time.split(' ');
      let departureTime = timeSplit[timeSplit.length === 1 ? 0 : 1];

      // WARNING: hard coded Time Zone !
      startDate = moment
        .tz(
          `${startDate} ${departureTime}`,
          `${DATE_FORMAT} HH:mm`,
          'Europe/Paris'
        )
        .format();
    }

    const namePrefix = formatDistance(distance) || `Course ${i}`;

    return {
      '@context': 'http://schema.org',
      '@type': 'Event',
      url,
      location,
      name: `${namePrefix} | ${title}`,
      startDate,
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'EUR'
      },
      eventStatus: 'EventScheduled'
    };
  });
};
