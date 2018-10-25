import React from "react";
import Router from "next/router";
import moment from "moment";
import { connect } from "react-redux";

import CustomError from "./_error";

import EventList from "../components/EventList";
import JSONLD from "../components/JSONLD";
import EventListNotFoundError from "../components/EventListNotFoundError";

import { pageview, event } from "../utils/gtag";
import { getEventListStructuredData } from "../utils/structuredData";

import {
  setSelectedEvent,
  setEventList,
  setEventsQuery,
  toggleSearch,
  addPlace
} from "../actions";
import { NO_EVENT_SELECTED } from "../enums";
import { API_EVENT_LIST_DEPARTMENT, API_EVENT_LIST_AROUND } from "../api";

class Events extends React.PureComponent {
  static async getInitialProps({ isServer, res, store, query, ...context }) {
    if (isServer) {
      if (res.statusCode === 404) return { error: { code: 404 } };
      if (res.statusCode !== 200) return { error: { code: 500 } };

      const { events, place, eventsQuery = {} } = query;

      if (place) store.dispatch(addPlace(place));
      store.dispatch(setEventsQuery(eventsQuery));
      store.dispatch(setEventList(events));

      if (place) {
        query.place = place.place_id;
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
  }

  static defaultProps = {
    error: null
  };

  componentDidMount() {
    Router.prefetch("/event");

    const { query, position, depCode, eventsQuery } = this.props;

    if (query.position && query.position !== eventsQuery.position) {
      this.fetchEvents(API_EVENT_LIST_AROUND, query.position);
      this.props.dispatch(setEventsQuery({ position: query.position }));
    }

    if (query.depCode && query.depCode !== eventsQuery.depCode) {
      this.fetchEvents(API_EVENT_LIST_DEPARTMENT, query.depCode);
      this.props.dispatch(setEventsQuery({ depCode: query.depCode }));
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

      if (nextQuery.position !== query.position) {
        this.fetchEvents(API_EVENT_LIST_AROUND, nextQuery.position);
        this.props.dispatch(setEventsQuery({ position: nextQuery.position }));
      } else if (nextQuery.depCode !== query.depCode) {
        this.fetchEvents(API_EVENT_LIST_DEPARTMENT, nextQuery.depCode);
        this.props.dispatch(setEventsQuery({ depCode: nextQuery.depCode }));
      }
    }

    if (nextProps.searchingGeohash && !this.props.searchingGeohash) {
      this.setState({ loading: true });
    }
  }

  render() {
    const { query, path, events, error } = this.props;

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
        {/* <EventsHeaders events={events} path={path} /> */}

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
    this.setState({ loading: true });

    let res = await this.props.getEventList(type, value);
    this.props.dispatch(setEventList(res.events));

    this.setState({ loading: false });
  }
}

function mapStateToProps(state) {
  return {
    eventsQuery: state.eventsQuery,
    events: state.events,
    searchingGeohash: state.searchingGeohash
  };
}

export default connect(mapStateToProps)(Events);
