import Head from 'next/head';
import moment from 'moment';

import Layout from '../components/Layout';
import EventPage from '../components/EventPage';

const getEventStructuredData = function(event) {
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

const Event = props => (
  <Layout>
    <Head>
      <title>{`${props.event.title} | La Foulée`}</title>
      <script type={'application/ld+json'}>
        {getEventStructuredData(props.event)}
      </script>
    </Head>
    <EventPage data={props.event} />
  </Layout>
);

Event.getInitialProps = async function({ query }) {
  if (query.event && query.event.title) {
    return { event: query.event };
  }
  return { event: { title: 'Data to fetch in client', activities: [] } };
};

export default Event;
