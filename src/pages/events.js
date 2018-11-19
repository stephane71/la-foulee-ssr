import React from "react";
import Router from "next/router";
import moment from "moment";
import { connect } from "react-redux";

import CustomError from "./_error";

import EventListMetaHeaders from "../headers/events";

import EventsProvider from "../components/EventsProvider";
import PlaceProvider from "../components/PlaceProvider";
import EventList from "../components/EventList";
import EventListNotFoundError from "../components/EventListNotFoundError";
import JSONLD from "../components/JSONLD";

import { pageview, event } from "../utils/gtag";
import { getEventListStructuredData } from "../utils/structuredData";

import {
  setSelectedEvent,
  setEventList,
  toggleSearch,
  addPlace,
  setPosition
} from "../actions";
import { NO_EVENT_SELECTED } from "../enums";

class Events extends React.PureComponent {
  static async getInitialProps({ isServer, res, store, query, ...context }) {
    let initialPlace = {};

    if (isServer) {
      if (res.statusCode === 404) return { error: { code: 404 } };
      if (res.statusCode !== 200) return { error: { code: 500 } };

      const { events, place, position = null } = query;

      if (place) store.dispatch(addPlace(place));
      store.dispatch(setPosition(position));
      store.dispatch(setEventList(events));

      if (place) {
        query.placeSlug = place.slug;
      }
    }

    return {};
  }

  constructor(props) {
    super(props);

    this.handleTriggerSearch = this.handleTriggerSearch.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
  }

  static defaultProps = {
    error: null
  };

  componentDidMount() {
    Router.prefetch("/event");

    if (this.props.error) return;

    pageview({
      title: "Event list",
      url: window.location.href,
      path: this.props.path
    });
  }

  render() {
    const { query, path, error } = this.props;

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
      <PlaceProvider placeSlug={query.placeSlug} getPlace={this.props.getPlace}>
        {place => (
          <EventsProvider
            depCode={query.depCode || null}
            position={query.position || null}
            getEventList={this.props.getEventList}
          >
            {({ events, loading }) => (
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
                  loading={loading}
                  onSelectEvent={this.handleEventSelection}
                />

                <JSONLD data={getEventListStructuredData(events)} />
              </>
            )}
          </EventsProvider>
        )}
      </PlaceProvider>
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
}

export default connect()(Events);
