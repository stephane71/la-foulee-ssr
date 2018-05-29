import Router from 'next/router';
import { connect } from 'react-redux';

import EventList from '../components/EventList';
import EventDetails from '../components/EventDetails';
import SVGWrapper from '../components/SVGWrapper';
import withEventList from '../components/withEventList';

import CrossIcon from '../svgs/ic_close_black_24px.svg';

import { setEventListReadyFlag, setSelectedEvent } from '../actions';
import { NO_EVENT_SELECTED, DESKTOP } from '../enums';
import { SECONDARY_COLOR } from '../colors';
import { getSpacing } from '../styles-variables';

const ICON_COLOR = '#8FB0A9';

const EventDetailsWrapper = ({ onClose, event }) => (
  <div className={'EventList-SelectedEvent'}>
    <div className={'EventList-SelectedEventHeader'}>
      <SVGWrapper
        icon={CrossIcon}
        fill={ICON_COLOR}
        onClick={onClose}
        className={'Overlay-closeButton Button--circle'}
      />
    </div>
    <EventDetails data={event} />

    <style jsx>{`
      .EventList-SelectedEvent {
        display: flex;
        flex-direction: column;
      }

      .EventList-SelectedEvent,
      .EventList-SelectedEvent:before {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        z-index: 100;
        transform: scale(1);
        transition: transform 0.25s ease-in-out;
      }

      .EventList-SelectedEvent:before {
        content: '';
        background-color: ${SECONDARY_COLOR};
        z-index: -1;
        backdrop-filter: blur(3px);
        opacity: 0.3;
      }

      .EventList-SelectedEventHeader {
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
      }
    `}</style>
  </div>
);

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
    const { events, loading, event, media, keyword } = this.props;

    return (
      <>
        <EventList
          data={events}
          loading={loading}
          event={event}
          desktop={media === DESKTOP}
          onSelectEvent={this.handleEventSelection}
          onListRendered={this.handleListRendered}
        />

        {keyword && (
          <EventDetailsWrapper
            event={event}
            onClose={this.handleCloseSelectedEvent}
          />
        )}
      </>
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
