import Router from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import Error from 'next/error';
import css from 'styled-jsx/css';
import { connect } from 'react-redux';

import EventDetails from '../components/EventDetails';
import { ScrollElementContext } from '../components/Layout';

import { getEventStructuredData } from '../utils/structuredData';
import { pageview } from '../utils/gtag';

import { DESKTOP, NO_EVENT_SELECTED } from '../enums';
import { white } from '../colors';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;

const style = css`
  .EventPage {
    min-height: 100%;
    ${'' /* Prevent no rendering page in Safari mobile */} overflow-y: scroll;
    background: ${white};
    -webkit-overflow-scrolling: touch;
  }

  .EventPage--desktop {
    overflow-y: initial;
  }
`;

class EventPage extends React.PureComponent {
  static async getInitialProps({ isServer, req, res }) {
    let event = NO_EVENT_SELECTED;
    if (req) {
      const getEvent = require('../server/getEvent');

      try {
        event = (await getEvent(req.params.keyword)) || NO_EVENT_SELECTED;
        if (!event) res.statusCode = 404;
      } catch (e) {
        res.statusCode = 404;
      }
    }

    return {
      isServer,
      eventServerSide: event
    };
  }

  state = {
    desktop: false,
    isServer: this.props.isServer
  };

  componentDidMount() {
    Router.prefetch('/events');

    this.setState({ desktop: this.props.media === DESKTOP, isServer: false });

    pageview({
      title: 'Event details',
      url: window.location.href,
      path: this.props.path
    });
  }

  render() {
    const { desktop, isServer } = this.state;
    const { path, eventServerSide, eventStored } = this.props;

    let event = eventServerSide || eventStored;

    if (!event) return <Error statusCode={404} />;

    return (
      <div className={`EventPage ${desktop ? 'EventPage--desktop' : ''}`}>
        <Head>
          <title>{`${event.title} | La Foulée`}</title>
          <link rel={'canonical'} href={`${APP_URL}${path}`} />
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

        <EventDetails
          data={event}
          desktop={desktop}
          isServer={isServer}
          onClickOrgaLink={this.handleClickOrgaLink}
        />

        <style jsx>{style}</style>
      </div>
    );
  }

  handleClickOrgaLink(href = '') {
    event({
      action: 'Orga Link',
      category: 'Event',
      label: 'Click on orga link',
      value: href
    });
  }
}

function mapStateToProps(state) {
  return {
    eventStored: state.event,
    media: state.media
  };
}

export default connect(mapStateToProps)(EventPage);
