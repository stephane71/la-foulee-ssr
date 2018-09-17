import Router from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
import moment from 'moment';
import { connect } from 'react-redux';

import CustomError from './_error';

const EventDetailsMobile = dynamic(import('../components/EventDetailsMobile'), {
  loading: () => null
});
const EventDetailsDesktop = dynamic(
  import('../components/EventDetailsDesktop'),
  {
    loading: () => null
  }
);

import JSONLD from '../components/JSONLD';

import getEventDescription from '../utils/getEventDescription';
import { getEventStructuredData } from '../utils/structuredData';
import { pageview, event } from '../utils/gtag';

import { DESKTOP, NO_EVENT_SELECTED } from '../enums';
import { white } from '../colors';
import { setSelectedEvent } from '../actions';
import { getSpacing } from '../styles-variables';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;

const style = css`
  .EventPage {
    background: ${white};
  }

  .EventPage--desktop {
    overflow-y: initial;
  }
`;

class EventPage extends React.PureComponent {
  static async getInitialProps({ isServer, req, res, query }) {
    let event = NO_EVENT_SELECTED;
    let noEdition = false;

    if (req) {
      const getEvent = require('../server/getEvent');
      const { keyword, edition } = req.params;
      noEdition = !edition;

      try {
        if (keyword)
          event = (await getEvent(keyword, edition)) || NO_EVENT_SELECTED;
        if (!event) {
          console.log('--- [La Foulee] ---');
          console.log(
            'EventPage | getInitialProps: No event found for "',
            keyword,
            '"'
          );
          res.statusCode = 404;
        }
      } catch (e) {
        console.log('--- [La Foulee] ---');
        console.log(
          'EventPage | getInitialProps: An error occurred when fetching the event',
          keyword
        );
        console.log('--- Error ---');
        console.log(e);
        res.statusCode = 404;
      }
    }

    return {
      isServer,
      eventServerSide: event,
      noEdition
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      desktop: false,
      isServer: props.isServer
    };

    this.handleClickOrgaLink = this.handleClickOrgaLink.bind(this);
  }

  componentDidMount() {
    const { eventServerSide, eventStored } = this.props;
    if (eventServerSide && !eventStored) {
      this.props.dispatch(setSelectedEvent(eventServerSide));
    }

    Router.prefetch('/events');

    this.setState({ desktop: this.props.media === DESKTOP, isServer: false });

    pageview({
      title: 'Event details',
      url: window.location.href,
      path: this.props.path
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.media !== nextProps.media) {
      this.setState({ desktop: nextProps.media === DESKTOP });
    }
  }

  render() {
    const { desktop, isServer } = this.state;
    const { path, eventServerSide, eventStored, noEdition } = this.props;

    const event = eventServerSide || eventStored;

    if (!event) return <CustomError />;

    const year = moment
      .unix(event.date)
      .utc()
      .year();

    /** METAs:start **/
    const canonical = `${APP_URL}${path}${noEdition ? `/${year}` : ''}`;
    const description = getEventDescription(event);
    const imageTwitter = `${ASSETS_URL}/android-chrome-512x512.png`;
    const imageFB = `${ASSETS_URL}/glyph.dominant.144x144%402x.png`;
    /** METAs:end **/

    return (
      <div
        className={`EventPage ${
          desktop ? 'EventPage--desktop' : 'EventPage--mobile'
        }`}
      >
        <Head>
          <title>{`La Foulée | ${event.title}`}</title>
          <link rel={'canonical'} href={canonical} />
          <meta name={'description'} content={description} />

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

        {!isServer &&
          !desktop && (
            <EventDetailsMobile
              data={event}
              desktop={desktop}
              isServer={isServer}
              onClickOrgaLink={this.handleClickOrgaLink}
            />
          )}

        {!isServer &&
          desktop && (
            <EventDetailsDesktop
              data={event}
              desktop={desktop}
              isServer={isServer}
              onClickOrgaLink={this.handleClickOrgaLink}
            />
          )}

        <JSONLD data={getEventStructuredData(event, { description, path })} />

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
