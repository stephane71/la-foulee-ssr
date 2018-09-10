import Router from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import CustomError from './_error';

import EventList from '../components/EventList';
import JSONLD from '../components/JSONLD';
import EventListNotFoundError from '../components/EventListNotFoundError';
import { SelectedCityContext } from '../components/Layout';

import { pageview, event } from '../utils/gtag';
import { getEventListStructuredData } from '../utils/structuredData';

import {
  setSelectedEvent,
  setEventList,
  setUserPosition,
  toggleSearch,
  addCity
} from '../actions';
import { NO_EVENT_SELECTED } from '../enums';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;

function getEventListDescription(events, city) {
  return `Retrouvez les ${
    events.length
  } evénements de courses à pieds autour de ${city.name} ${
    events.length
      ? `à partir du ${moment
          .unix(events[0].date)
          .utc()
          .format('dddd DD/MM/YYYY')}`
      : ''
  }`;
}

function getHeadData(events, city) {
  return {
    imageTwitter: `${ASSETS_URL}/android-chrome-512x512.png`,
    imageFB: `${ASSETS_URL}/glyph.dominant.144x144%402x.png`,
    title: `Tous les evénements${city ? ` autour de ${city.name}` : ''}`,
    description: getEventListDescription(events, city)
  };
}

class Events extends React.PureComponent {
  static async getInitialProps({ isServer, res, store, query, ...context }) {
    let city = null;
    let initialCity = null;

    if (isServer) {
      if (res.statusCode === 404) {
        return { error: { code: 404 } };
      }
      if (res.statusCode !== 200) {
        return { error: { code: 500 } };
      }

      const { city, position, events } = query;

      store.dispatch(addCity(city));
      store.dispatch(setUserPosition(position));
      store.dispatch(setEventList(events));

      query.city = city.place_id;
      initialCity = city;
    }

    return { initialCity };
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.handleEventSelection = this.handleEventSelection.bind(this);
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
    const {
      getEventListAround,
      query,
      path,
      events,
      error,
      initialCity,
      dispatch
    } = this.props;
    const { position } = query;

    if (error) {
      return (
        <>
          {error.code === 404 ? (
            <EventListNotFoundError
              onTriggerSearch={() => dispatch(toggleSearch())}
            />
          ) : (
            <CustomError code={error.code} />
          )}
        </>
      );
    }

    return (
      <>
        <SelectedCityContext.Consumer>
          {city => {
            city = city || initialCity;
            const { imageTwitter, imageFB, title, description } = getHeadData(
              events,
              city
            );

            return (
              <Head>
                <title>{`La Foulée | ${title}`}</title>
                <link rel={'canonical'} href={`${APP_URL}${path}`} />
                <meta name={'description'} content={description} />

                {/* TWITTER */}
                <meta name={'twitter:card'} content={'summary'} />
                <meta name={'twitter:site'} content={'@_LaFoulee'} />
                <meta name={'twitter:title'} content={title} />
                <meta name={'twitter:description'} content={description} />
                <meta name={'twitter:image'} content={imageTwitter} />

                {/* OPEN GRAPH */}
                <meta property={'og:url'} content={`${APP_URL}${path}`} />
                <meta property={'og:title'} content={`title`} />
                <meta property={'og:description'} content={description} />
                <meta property={'og:image'} content={imageFB} />
              </Head>
            );
          }}
        </SelectedCityContext.Consumer>

        <EventList
          data={events}
          loading={this.state.loading}
          onSelectEvent={this.handleEventSelection}
        />

        <JSONLD data={getEventListStructuredData(events)} />
      </>
    );
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
