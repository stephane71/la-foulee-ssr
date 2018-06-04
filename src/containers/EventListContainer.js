import Router from 'next/router';
import css from 'styled-jsx/css';
import { connect } from 'react-redux';

import EventList from '../components/EventList';
import Event from '../components/Event';
import withEventList from '../components/withEventList';

import { setEventListReadyFlag, setSelectedEvent } from '../actions';
import { NO_EVENT_SELECTED, DESKTOP, MAX_WIDTH, HEIGHT_APPBAR } from '../enums';
import { APP_BACKGROUND_COLOR } from '../colors';

const style = css`
  .EventListContainer {
    height: 100%;
  }

  .EventDetails-Wrapper {
    position: fixed;
    top: ${HEIGHT_APPBAR}px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    z-index: 20;
    max-width: ${MAX_WIDTH}px;
    overflow: auto;
  }
`;

export class EventListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleCloseSelectedEvent = this.handleCloseSelectedEvent.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleListRendered = this.handleListRendered.bind(this);
  }

  componentDidMount() {
    if (this.props.position && !this.props.events.length) {
      this.props.fetchEvents(this.props.position);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.position !== this.props.position) {
      this.props.fetchEvents(nextProps.position);
    }
  }

  render() {
    const { events, event, loading, media, keyword } = this.props;

    return (
      <div className={'EventListContainer'}>
        <EventList
          data={events}
          loading={loading}
          desktop={media === DESKTOP}
          onSelectEvent={this.handleEventSelection}
          onListRendered={this.handleListRendered}
        />

        {keyword && (
          <div className={'EventDetails-Wrapper'}>
            <Event data={event} />
          </div>
        )}

        <style jsx>{style}</style>
      </div>
    );
  }

  handleCloseSelectedEvent() {
    this.handleEventSelection(NO_EVENT_SELECTED);
  }

  handleEventSelection(event) {
    if (event === NO_EVENT_SELECTED) {
      Router.back();
      return;
    }

    this.props.dispatch(setSelectedEvent(event));
    Router.push(
      { pathname: '/', query: { keyword: event.keyword } },
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
