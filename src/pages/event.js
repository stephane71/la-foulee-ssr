import Head from 'next/head';
import { connect } from 'react-redux';

import Event from '../components/Event';

import { getEventStructuredData } from '../utils/structuredData';

const EventPage = ({ query, event }) => {
  event = query.keyword ? event : query.event;

  return (
    <div className={'EventPage'}>
      <Head>
        <title>{`${event.title} | La Foulée`}</title>
        <script type={'application/ld+json'}>
          {getEventStructuredData(event)}
        </script>
      </Head>

      {event ? (
        <Event data={event} />
      ) : (
        <div>{`Cette évenement n'existe pas :(`}</div>
      )}

      <style jsx>{`
        .EventPage {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    event: state.event
  };
}

export default connect(mapStateToProps)(EventPage);
