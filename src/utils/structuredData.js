import moment from 'moment';

export const getSearchStructuredData = function() {
  const jsonLD = {};
  return JSON.stringify(jsonLD);
};

export const getEventStructuredData = function(event) {
  const jsonLD = {
    '@context': 'http://schema.org',
    '@type': 'Event',
    url: `https://www.la-foulee.com/event/${event.keyword}`,
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
        // addressLocality: event.locality,
        postalCode: event.dep,
        addressCountry: 'FR'
      }
    }
  };
  return JSON.stringify(jsonLD);
};
