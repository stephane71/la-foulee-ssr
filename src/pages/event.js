import Head from 'next/head';
import { connect } from 'react-redux';

import Event from '../components/Event';
import { ScrollElementContext } from '../components/Layout';

import { getEventStructuredData } from '../utils/structuredData';
import { pageview } from '../utils/gtag';

class EventPage extends React.PureComponent {
  componentDidMount() {
    // pageview({
    //   title: 'Event details',
    //   url: window.location.href,
    //   path: `/event/${this.props.query.event.keyword}`
    // });
  }

  render() {
    let event = this.props.query.event || this.props.event;

    return (
      <div className={'Event'}>
        <Head>
          <title>{`${event.title} | La Foulée`}</title>
          <script type={'application/ld+json'}>
            {getEventStructuredData(event)}
          </script>
        </Head>

        <ScrollElementContext.Consumer>
          {scrollElement => {
            if (scrollElement) scrollElement.scrollTop = 0;
            return null;
          }}
        </ScrollElementContext.Consumer>

        {event ? (
          <Event data={event} />
        ) : (
          <div>{`Cette évenement n'existe pas :(`}</div>
        )}

        <style jsx>{`
          .Event {
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

export default connect(mapStateToProps)(EventPage);
