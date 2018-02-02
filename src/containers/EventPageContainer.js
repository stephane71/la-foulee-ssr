import Head from 'next/head';
import { connect } from 'react-redux';

import EventPage from '../components/EventPage';
import Loader from '../components/Loader';

import { getEventStructuredData } from '../utils/structuredData';

export class EventPageContainer extends React.PureComponent {
  render() {
    const { event } = this.props;
    return (
      <div className={'EventPageContainer'}>
        {event && (
          <Head>
            <title>{`${event.title} | La Foulée`}</title>
            <script type={'application/ld+json'}>
              {getEventStructuredData(event)}
            </script>
          </Head>
        )}

        {event ? <EventPage data={event} /> : <Loader />}

        <style jsx>{`
          .EventPageContainer {
            margin: auto;
            max-width: 768px;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: state.event
  };
}

export default connect(mapStateToProps)(EventPageContainer);
