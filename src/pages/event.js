import Router from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import Error from 'next/error';
import css from 'styled-jsx/css';
import moment from 'moment';
import { connect } from 'react-redux';

import EventDetails from '../components/EventDetails';
import { ScrollElementContext } from '../components/Layout';

import { getEventStructuredData } from '../utils/structuredData';
import { pageview, event } from '../utils/gtag';

import { DESKTOP, NO_EVENT_SELECTED } from '../enums';
import { white } from '../colors';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;

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
        if (!event) {
          console.log(
            '[La Foulee] EventPage | getInitialProps: No event found for',
            req.params.keyword
          );
          res.statusCode = 404;
        }
      } catch (e) {
        console.log(
          '[La Foulee] EventPage | getInitialProps: An error occurred when fetching the event',
          req.params.keyword
        );
        console.log(JSON.stringify(e));
        res.statusCode = 404;
      }
    }

    return {
      isServer,
      eventServerSide: event
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      desktop: false,
      isServer: this.props.isServer
    };

    this.handleClickOrgaLink = this.handleClickOrgaLink.bind(this);
  }

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

    let eventDateMeta = moment.unix(event.date).format('dddd DD/MM/YYYY');
    eventDateMeta = eventDateMeta[0].toUpperCase() + eventDateMeta.slice(1);
    const description = `${eventDateMeta} à ${event.city} (${
      event.department.code
    })`;
    const imageTwitter = `${ASSETS_URL}/android-chrome-512x512.png`;
    const imageFB = `${ASSETS_URL}/glyph.dominant.144x144%402x.png`;

    return (
      <div className={`EventPage ${desktop ? 'EventPage--desktop' : ''}`}>
        <Head>
          <title>{`La Foulée | ${event.title}`}</title>
          <link rel={'canonical'} href={`${APP_URL}${path}`} />
          <script type={'application/ld+json'}>
            {getEventStructuredData(event)}
          </script>

          {/* TWITTER */}
          <meta name={'twitter:card'} content={'summary'} />
          <meta name={'twitter:site'} content={'@_LaFoulee'} />
          <meta name={'twitter:title'} content={event.title} />
          <meta name={'twitter:description'} content={description} />
          <meta name={'twitter:image'} content={imageTwitter} />

          {/* OPEN GRAPH */}
          <meta property={'og:url'} content={`${APP_URL}${path}`} />
          <meta property={'og:title'} content={event.title} />
          <meta property={'og:description'} content={description} />
          <meta property={'og:image'} content={imageFB} />
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
