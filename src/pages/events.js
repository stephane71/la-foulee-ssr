import Router from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import EventList from '../components/EventList';

import { pageview, event } from '../utils/gtag';
import { getEventListStructuredData } from '../utils/structuredData';

import {
  setSelectedEvent,
  setEventList,
  setUserPosition,
  toggleSearch
} from '../actions';
import { NO_EVENT_SELECTED } from '../enums';
import { getSpacing } from '../styles-variables';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;

class Events extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleSearchCityToggle = this.handleSearchCityToggle.bind(this);
  }

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
    }
  }

  render() {
    const { getEventListAround, query, path, events } = this.props;
    const { position, city } = query;

    const imageTwitter = `${ASSETS_URL}/android-chrome-512x512.png`;
    const imageFB = `${ASSETS_URL}/glyph.dominant.144x144%402x.png`;
    const title = `Tous les evénements${city ? ` autour de ${city}` : ''}`;
    const description = `Retrouvez les ${
      events.length
    } evénements autour de ${city} ${
      events.length
        ? `à partir du ${moment.unix(events[0].date).format('dddd DD/MM/YYYY')}`
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
          <script type={'application/ld+json'}>
            {getEventListStructuredData(events)}
          </script>

          {/* TWITTER */}
          <meta name={'twitter:card'} content={'summary'} />
          <meta name={'twitter:site'} content={'@_LaFoulee'} />
          <meta name={'twitter:title'} content={title} />
          <meta name={'twitter:description'} content={description} />
          <meta name={'twitter:image'} content={imageTwitter} />

          {/* OPEN GRAPH */}
          <meta property={'og:url'} content={`${APP_URL}${path}`} />
          <meta property={'og:title'} content={event.title} />
          <meta property={'og:description'} content={description} />
          <meta property={'og:image'} content={imageFB} />
        </Head>

        {position && city ? (
          <EventList
            data={events}
            loading={this.state.loading}
            onSelectEvent={this.handleEventSelection}
          />
        ) : (
          <div className={'Events-NoQuery'}>
            <h3>{'Choisissez une ville'}</h3>
            <p>
              {`Nous avons besoins qu'une ville soit sélectionnée pour vous proposer des événements !`}
            </p>
            <button
              className={'Button Button--fixed'}
              onClick={this.handleSearchCityToggle}
            >
              {'Sélectionner une ville'}
            </button>
            <style jsx>{`
              .Events-NoQuery {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: ${getSpacing('m')}px;
                margin-top: ${getSpacing('l')}px;
                text-align: center;
              }
            `}</style>
          </div>
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

    const path = `/event/${selectedEvent.keyword}`;
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

Events.getInitialProps = function({ store, isServer, ...context }) {
  return {};
};

function mapStateToProps(state) {
  return {
    position: state.position,
    events: state.events
  };
}

export default connect(mapStateToProps)(Events);
