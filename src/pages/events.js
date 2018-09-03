import Router from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import EventList from '../components/EventList';
import JSONLD from '../components/JSONLD';

import { pageview, event } from '../utils/gtag';
import { getEventListStructuredData } from '../utils/structuredData';

import {
  setSelectedEvent,
  setEventList,
  setUserPosition,
  toggleSearch,
  setInitialCity
} from '../actions';
import { NO_EVENT_SELECTED } from '../enums';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;

function getEventListDescription(events, city) {
  return `Retrouvez les ${
    events.length
  } evénements de courses à pieds autour de ${city} ${
    events.length
      ? `à partir du ${moment
          .unix(events[0].date)
          .utc()
          .format('dddd DD/MM/YYYY')}`
      : ''
  }`;
}

class Events extends React.PureComponent {
  static async getInitialProps({ isServer, req, res, store, ...context }) {
    let city = null;
    if (isServer) {
      if (res.statusCode === 404) {
        return { error: { code: 404 } };
      }

      if (context.query.city) {
        store.dispatch(setInitialCity(context.query.city));
      }
    }

    return {};
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleSearchCityToggle = this.handleSearchCityToggle.bind(this);
  }

  static defaultProps = {
    error: null
  };

  componentDidMount() {
    Router.prefetch('/event');

    const { query, position } = this.props;
    if (query.position !== position) {
      this.fetchEvents(query.position);
    }

    pageview({
      title: 'Event list',
      url: window.location.href,
      path: this.props.path
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query.position !== this.props.query.position) {
      this.fetchEvents(nextProps.query.position);
    } else {
      this.setState({ loading: false });
    }

    if (nextProps.searchingGeohash && !this.props.searchingGeohash) {
      this.setState({ loading: true });
    }
  }

  render() {
    const { getEventListAround, query, path, events, error } = this.props;
    const { position, city } = query;

    const imageTwitter = `${ASSETS_URL}/android-chrome-512x512.png`;
    const imageFB = `${ASSETS_URL}/glyph.dominant.144x144%402x.png`;
    const title = `Tous les evénements${city ? ` autour de ${city}` : ''}`;
    const description = `Retrouvez les ${
      events.length
    } evénements autour de ${city} ${
      events.length
        ? `à partir du ${moment
            .unix(events[0].date)
            .utc()
            .format('dddd DD/MM/YYYY')}`
        : ''
    }`;

    return (
      <>
        <Head>
          <title>{`La Foulée | ${title}`}</title>
          {process.env.NODE_ENV === 'production' && (
            <meta name={'robots'} content={`noindex, follow`} />
          )}
          <link rel={'canonical'} href={`${APP_URL}${path}`} />

          <JSONLD data={getEventListStructuredData(events)} />

          {/* TWITTER */}
          <meta name={'twitter:card'} content={'summary'} />
          <meta name={'twitter:site'} content={'@_LaFoulee'} />
          <meta name={'twitter:title'} content={title} />
          {/* <meta name={'twitter:description'} content={description} /> */}
          <meta name={'twitter:image'} content={imageTwitter} />

          {/* OPEN GRAPH */}
          <meta property={'og:url'} content={`${APP_URL}${path}`} />
          <meta property={'og:title'} content={title} />
          {/* <meta property={'og:description'} content={description} /> */}
          <meta property={'og:image'} content={imageFB} />
        </Head>

        {error && error.code === 404 ? (
          <div>{'List unknown'}</div>
        ) : (
          <EventList
            data={events}
            loading={this.state.loading}
            onSelectEvent={this.handleEventSelection}
          />
        )}
      </>
    );
  }

  handleSearchCityToggle() {
    event({
      action: 'Trigger Search',
      category: 'Search',
      label: 'From events page'
    });

    this.props.dispatch(toggleSearch());
  }

  handleEventSelection(selectedEvent) {
    if (selectedEvent === NO_EVENT_SELECTED) {
      Router.back();
      return;
    }

    this.props.dispatch(setSelectedEvent(selectedEvent));

    const year = moment
      .unix(selectedEvent.date)
      .utc()
      .year();
    const path = `/event/${selectedEvent.keyword}/${year}`;

    Router.push(
      { pathname: '/event', query: { keyword: selectedEvent.keyword } },
      path
    );

    event({
      action: 'Select Event',
      category: 'Event',
      label: 'Select an event in the list',
      value: selectedEvent.keyword
    });
  }

  async fetchEvents(position) {
    this.setState({ loading: true });

    const { events } = await this.props.getEventListAround(position);

    this.props.dispatch(setUserPosition(position));
    this.props.dispatch(setEventList(events));

    this.setState({ loading: false });
  }
}

function mapStateToProps(state) {
  return {
    position: state.position,
    events: state.events,
    searchingGeohash: state.searchingGeohash
  };
}

export default connect(mapStateToProps)(Events);
