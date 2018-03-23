import VirtualizedList from './VirtualizedList';
import EventListDate from './EventListDate';
import Loader from './Loader';
import MobileFilters from './MobileFilters';
import EventDetails from './EventDetails';

import SVGWrapper from './SVGWrapper';
import CrossIcon from '../svgs/ic_close_black_24px.svg';
import DesktopFilters, { DESKTOP_HEIGHT_FILTERS } from './DesktopFilters';

import { getSpacing, BaseLineHeight, Base } from '../styles-variables';
import { APP_BACKGROUND_COLOR } from '../colors';
import { HEIGHT_APPBAR, NO_EVENT_SELECTED } from '../enums';

// See EventListDate component: line height + 2 * vertical padding
const EVENT_LIST_DATE_HEIGHT = BaseLineHeight + 2 * getSpacing('m');

const FixedDateHeader = ({ date, desktop }) => (
  <div className={'FixedDateHeader'}>
    <EventListDate date={date} />
    <style jsx>{`
      .FixedDateHeader {
        background-color: ${APP_BACKGROUND_COLOR};
        position: fixed;
        top: ${desktop
          ? HEIGHT_APPBAR + DESKTOP_HEIGHT_FILTERS
          : HEIGHT_APPBAR}px;
        left: 0;
        width: 100%;
        z-index: 2;
      }
    `}</style>
  </div>
);

export default class EventList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      stickyDate: this.props.data.length && this.props.data[0].date,
      scrollUp: true,
      listRendered: false
    };

    this.handleStickyDate = this.handleStickyDate.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleListRendered = this.handleListRendered.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleCloseSelectedEvent = this.handleCloseSelectedEvent.bind(this);
  }

  render() {
    const { data, event, desktop } = this.props;

    if (!data.length && !this.props.loading) return <div>{'Empty list !'}</div>;

    // if (!data.length && this.props.loading)
    //   return (
    //     <div>
    //       {'Nous sommes presque prêt ! Les dernière données sont en routes...'}
    //     </div>
    //   );

    return (
      <div className={'EventList prevent-scroll'}>
        {this.state.listRendered && (
          <FixedDateHeader date={this.state.stickyDate} desktop={desktop} />
        )}

        <div
          ref={el => {
            this.scrollElement = el;
          }}
          className={'prevent-scroll'}
        >
          <VirtualizedList
            scrollElement={this.scrollElement}
            data={this.props.data}
            onSelectEvent={this.handleEventSelection}
            onChangeStickyDate={this.handleStickyDate}
            onReachEndList={this.handleLoadMore}
            onScroll={this.handleScroll}
            onListRendered={this.handleListRendered}
          />
        </div>

        {this.state.listRendered &&
          !desktop && <MobileFilters show={this.state.scrollUp} />}

        {this.state.listRendered &&
          desktop && <DesktopFilters show={this.state.scrollUp} />}

        {!this.state.listRendered && (
          <div className={'EventList-Loading'}>
            <Loader />
          </div>
        )}

        {event && (
          <div className={'EventList-SelectedEvent'}>
            <div className={'EventList-SelectedEventHeader'}>
              <SVGWrapper
                icon={CrossIcon}
                onClick={this.handleCloseSelectedEvent}
              />
            </div>
            <EventDetails data={event} />
          </div>
        )}

        <style jsx>{`
          .EventList {
            padding-top: ${desktop
              ? EVENT_LIST_DATE_HEIGHT + DESKTOP_HEIGHT_FILTERS
              : EVENT_LIST_DATE_HEIGHT}px;
            -webkit-overflow-scrolling: touch;
          }

          .EventList-Loading {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
          }

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
            z-index: 100;
            transform: scale(1);
            transition: transform 0.25s ease-in-out;
          }

          .EventList-SelectedEvent:before {
            content: '';
            background-color: #fff;
            z-index: -1;
            backdrop-filter: blur(3px);
            opacity: 0.8;
          }

          .EventList-SelectedEventHeader {
            padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
          }
        `}</style>
      </div>
    );
  }

  handleCloseSelectedEvent() {
    this.props.onSelectEvent(NO_EVENT_SELECTED);
  }

  handleEventSelection(data, elementPosition) {
    // For transition
    let windowPosition = elementPosition - this.scrollElement.scrollTop;
    windowPosition += HEIGHT_APPBAR + EVENT_LIST_DATE_HEIGHT;
    console.log('Position of the item in the window', windowPosition);

    this.props.onSelectEvent(data);
  }

  scrollTop = 0;

  handleStickyDate(stickyDate) {
    this.setState({ stickyDate });
  }

  handleLoadMore() {
    if (!this.props.loading) this.props.onLoadMore();
  }

  handleScroll({ scrollTop }) {
    const scrollUp =
      this.scrollTop > scrollTop ||
      (this.scrollTop === scrollTop && !scrollTop);
    this.scrollTop = scrollTop;
    this.setState({ scrollUp });
  }

  handleListRendered() {
    this.setState({ listRendered: true });
    this.props.onListRendered();
  }
}
