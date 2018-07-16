import moment from 'moment';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;
const APP_URL = publicRuntimeConfig.APP_URL;

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

export const getEventStructuredData = function(event) {
  const jsonLD = {
    '@context': 'http://schema.org',
    '@type': 'Event',
    url: `${APP_URL}/event/${event.keyword}`,
    name: event.title,
    startDate: moment.unix(event.date).format('YYYY-MM-DD'),
    description: `Évenement: ${event.title}, city: ${
      event.city
    }, date: ${moment.unix(event.date).format('DD/MM/YYYY')} | La Foulée`,
    location: {
      '@type': 'Place',
      name: event.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        postalCode: event.department.code,
        addressCountry: 'FR'
      }
    }
  };
  return JSON.stringify(jsonLD);
};
