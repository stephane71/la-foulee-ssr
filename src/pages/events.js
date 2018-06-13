import Router from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import React from 'react';
import { connect } from 'react-redux';

const EventList = dynamic(import('../components/EventList'), {
  ssr: false,
  loading: () => null
});
import { ScrollElementContext } from '../components/Layout';

import { setSelectedEvent, setEventList, setUserPosition } from '../actions';
import { NO_EVENT_SELECTED } from '../enums';
import { getEventListStructuredData } from '../utils/structuredData';

class Events extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.handleEventSelection = this.handleEventSelection.bind(this);
  }

  componentDidMount() {
    const { query, position } = this.props;
    this.fetchEvents(query.position, query.position !== position);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query.position !== this.props.query.position) {
      this.fetchEvents(nextProps.query.position);
    }
  }

  render() {
    const { getEventListAround, query } = this.props;
    const { events } = this.props;

    // Router redicrect to home instead
    if (!query.position) return <div>{'No query to fetch events'}</div>;

    return (
      <>
        <Head>
          <title>{`La Foulée | liste des evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventListStructuredData()}
          </script>
        </Head>

        <ScrollElementContext.Consumer>
          {scrollElement => (
            <EventList
              data={events}
              loading={this.state.loading}
              onSelectEvent={this.handleEventSelection}
              scrollElement={scrollElement}
            />
          )}
        </ScrollElementContext.Consumer>
      </>
    );
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
    // pageview({ title: 'Event details', url: window.location.href, path });
  }

  async fetchEvents(position, fetchCondition = true) {
    if (fetchCondition) {
      this.setState({ loading: true });
      const { events } = await this.props.getEventListAround(position);
      this.props.dispatch(setUserPosition(position));
      this.props.dispatch(setEventList(events));
    }
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
