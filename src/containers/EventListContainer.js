import Head from 'next/head';
import Router from 'next/router';
import { Fragment } from 'react';
import { connect } from 'react-redux';

import EventList from '../components/EventList';
import withEventList from '../components/withEventList';

import { getEventListStructuredData } from '../utils/structuredData';

import { setEventListReadyFlag, setSelectedEvent } from '../actions';
import { MAX_WIDTH, NO_EVENT_SELECTED, DESKTOP } from '../enums';

export class EventListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleListRendered = this.handleListRendered.bind(this);
  }

  componentDidMount() {
    if (this.props.position) this.props.fetchEvents(this.props.position);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.position !== this.props.position) {
      this.props.fetchEvents(nextProps.position);
    }
  }

  render() {
    return (
      <Fragment>
        <Head>
          <title>{`La Foulée | rechercher un evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventListStructuredData()}
          </script>
        </Head>

        <EventList
          data={this.props.events}
          loading={this.props.loading}
          event={this.props.keyword ? this.props.event : NO_EVENT_SELECTED}
          desktop={this.props.media === DESKTOP}
          onSelectEvent={this.handleEventSelection}
          onListRendered={this.handleListRendered}
        />
      </Fragment>
    );
  }

  handleEventSelection(event) {
    if (event === NO_EVENT_SELECTED) {
      Router.back();
      return;
    }

    this.props.dispatch(setSelectedEvent(event));
    Router.push(
      { pathname: '/', query: { from: 'search' } },
      `/event/${event.keyword}`
    );
  }

  handleListRendered() {
    this.props.dispatch(setEventListReadyFlag());
  }
}

function mapStateToProps(state) {
  return {
    event: state.event,
    events: state.events,
    media: state.media,
    position: state.position
  };
}

export default connect(mapStateToProps)(withEventList(EventListContainer));
