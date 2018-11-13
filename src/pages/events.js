import React from "react";
import Router from "next/router";
import moment from "moment";
import { connect } from "react-redux";

import CustomError from "./_error";

import EventListMetaHeaders from "../headers/events";

import EventList from "../components/EventList";
import EventListNotFoundError from "../components/EventListNotFoundError";
import JSONLD from "../components/JSONLD";

import getGeohash from "../utils/geohash";
import { pageview, event } from "../utils/gtag";
import { getEventListStructuredData } from "../utils/structuredData";

import {
  setSelectedEvent,
  setEventList,
  toggleSearch,
  addPlace
} from "../actions";
import { NO_EVENT_SELECTED } from "../enums";
import { API_EVENT_LIST_AROUND } from "../api";

class Events extends React.PureComponent {
  static async getInitialProps({ isServer, res, store, query, ...context }) {
    let initialPlace = {};

    if (isServer) {
      if (res.statusCode === 404) return { error: { code: 404 } };
      if (res.statusCode !== 200) return { error: { code: 500 } };

      const { events, place } = query;

      if (place) store.dispatch(addPlace(place));
      store.dispatch(setEventList(events));

      if (place) {
        query.placeSlug = place.slug;
      }
    }

    return {};
  }

  constructor(props) {
    super(props);

    const { placeMap, query } = props;

    const place = placeMap[query.placeSlug];
    const position = getGeohash(place.location);

    this.state = {
      place: { ...place, position },
      loading: false
    };

    this.handleTriggerSearch = this.handleTriggerSearch.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
  }

  static defaultProps = {
    error: null
  };

  componentDidMount() {
    Router.prefetch("/event");

    const { query, error, events } = this.props;
    const { place } = this.state;

    if (error) return;

    if (!place) {
      this.setState({ loading: true });

      this.getEventListPlace(query).then(place => {
        this.setState({ place });
        this.fetchEvents(API_EVENT_LIST_AROUND, place.position).then(() =>
          this.setState({ loading: false })
        );
      });
    } else if (!events.length) {
      this.fetchEvents(API_EVENT_LIST_AROUND, place.position).then(() =>
        this.setState({ loading: false })
      );
    }

    pageview({
      title: "Event list",
      url: window.location.href,
      path: this.props.path
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      const { query: nextQuery } = nextProps;
      const { query } = this.props;

      if (query.placeSlug !== nextQuery.placeSlug) {
        this.setState({ loading: true });

        this.getEventListPlace(nextQuery).then(place => {
          this.setState({ place });
          this.fetchEvents(API_EVENT_LIST_AROUND, place.position).then(() =>
            this.setState({ loading: false })
          );
        });
      }
    }
  }

  render() {
    const { query, path, events, error } = this.props;
    const { place, loading } = this.state;

    if (error) {
      return (
        <>
          {error.code === 404 ? (
            <EventListNotFoundError
              onTriggerSearch={this.handleTriggerSearch}
            />
          ) : (
            <CustomError code={error.code} />
          )}
        </>
      );
    }

    return (
      <>
        <EventListMetaHeaders
          events={events}
          path={path}
          place={place}
          query={query}
        />

        <EventList
          place={place}
          data={events}
          loading={this.state.loading}
          onSelectEvent={this.handleEventSelection}
        />

        <JSONLD data={getEventListStructuredData(events)} />
      </>
    );
  }

  handleTriggerSearch() {
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

    Router.push(
      {
        pathname: "/event",
        query: { keyword: selectedEvent.keyword, edition: year }
      },
      `/event/${selectedEvent.keyword}/${year}`
    );

    event({
      action: "Select Event",
      category: "Event",
      label: "Select an event in the list",
      value: selectedEvent.keyword
    });
  }

  async fetchEvents(type, value) {
    let res = await this.props.getEventList(type, value);
    this.props.dispatch(setEventList(res.events));

    return;
  }

  async getEventListPlace({ placeSlug } = {}) {
    let place = this.props.placeMap[placeSlug];

    if (!place) {
      place = await this.props.getPlace({ placeSlug });
      this.props.dispatch(addPlace(place));
    }

    return { ...place, position: getGeohash(place.location) };
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    placeMap: state.placeMap
  };
}

export default connect(mapStateToProps)(Events);
