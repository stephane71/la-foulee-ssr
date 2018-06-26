import Router from 'next/router';
import Head from 'next/head';
import React from 'react';
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
    const { getEventListAround, query } = this.props;
    const { events } = this.props;

    const { position, city } = query;

    return (
      <>
        <Head>
          <title>{`La Foulée | liste des evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventListStructuredData()}
          </script>
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

  handleEventSelection(event) {
    if (event === NO_EVENT_SELECTED) {
      Router.back();
      return;
    }

    this.props.dispatch(setSelectedEvent(event));

    const path = `/event/${event.keyword}`;
    Router.push(
      { pathname: '/event', query: { keyword: event.keyword } },
      path
    );

    event({
      action: 'Select Event',
      category: 'Event',
      label: 'Select an event in the list',
      value: event.keyword
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
