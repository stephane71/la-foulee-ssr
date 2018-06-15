import Router from 'next/router';
import Head from 'next/head';
import { connect } from 'react-redux';

import Event from '../components/Event';
import { ScrollElementContext } from '../components/Layout';

import { getEventStructuredData } from '../utils/structuredData';
import { pageview } from '../utils/gtag';

import { getSpacing } from '../styles-variables';
import { DESKTOP } from '../enums';

class EventPage extends React.PureComponent {
  componentDidMount() {
    Router.prefetch('/events');

    // pageview({
    //   title: 'Event details',
    //   url: window.location.href,
    //   path: `/event/${this.props.query.event.keyword}`
    // });
  }

  render() {
    let event = this.props.query.event || this.props.event;

    return (
      <div
        className={`Event-Page ${
          this.props.media === DESKTOP ? 'Event-Page--desktop' : ''
        }`}
      >
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
          .Event-Page {
            height: 100%;
            overflow-y: scroll;
            background: white;
            -webkit-overflow-scrolling: touch;
          }

          .Event-Page--desktop {
            border-radius: 8px;
            margin: ${getSpacing('m')}px auto;
            height: calc(100% - ${getSpacing('l')}px);
          }
        `}</style>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: state.event,
    media: state.media
  };
}

export default connect(mapStateToProps)(EventPage);
