import VirtualizedList from './VirtualizedList';
import EventListDate from './EventListDate';
import Loader from './Loader';
import MobileFilters from './MobileFilters';
import EventDetails from './EventDetails';

import SVGWrapper from './SVGWrapper';
import CrossIcon from '../svgs/ic_close_black_24px.svg';

import { getSpacing, BaseLineHeight, Base } from '../styles-variables';
import { APP_BACKGROUND_COLOR } from '../colors';
import { HEIGHT_APPBAR } from '../enums';

// See EventListDate component: line height + 2 * vertical padding
const EVENT_LIST_DATE_HEIGHT = BaseLineHeight + 2 * getSpacing('m');

const FixedDateHeader = ({ date }) => (
  <div className={'FixedDateHeader'}>
    <EventListDate date={date} />
    <style jsx>{`
      .FixedDateHeader {
        background-color: ${APP_BACKGROUND_COLOR};
        position: fixed;
        top: ${HEIGHT_APPBAR}px;
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
      listRendered: false,
      eventDetails: null
    };

    this.handleStickyDate = this.handleStickyDate.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleListRendered = this.handleListRendered.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleCloseSelectedEvent = this.handleCloseSelectedEvent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.closeSelectedEvent && this.state.eventDetails) {
      this.handleCloseSelectedEvent();
    }
  }

  render() {
    const { data } = this.props;

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
          <FixedDateHeader date={this.state.stickyDate} />
        )}

        <div
          ref={el => {
            this.scrollElement = el;
          }}
          className={'EventList-scrollElement prevent-scroll'}
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

        {this.state.listRendered && (
          <MobileFilters show={this.state.scrollUp} />
        )}

        {!this.state.listRendered && (
          <div className={'EventList-rendering'}>
            <Loader />
          </div>
        )}

        {this.state.eventDetails && (
          <div className={'EventList-selectedEvent'}>
            <div className={'EventList-selectedEventHeader'}>
              <SVGWrapper
                icon={CrossIcon}
                onClick={this.handleCloseSelectedEvent}
              />
            </div>
            <EventDetails data={this.state.eventDetails} />
          </div>
        )}

        <style jsx>{`
          .EventList-selectedEventHeader {
            background-color: #fff;
            padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
          }

          .EventList-selectedEvent {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
          }

          .EventList {
            padding-top: ${EVENT_LIST_DATE_HEIGHT}px;
            -webkit-overflow-scrolling: touch;
          }

          .EventList-rendering {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }

  handleCloseSelectedEvent() {
    this.setState({ eventDetails: null });
    this.props.onSelectEvent(null);
  }

  handleEventSelection(data, elementPosition) {
    // For transition
    let windowPosition = elementPosition - this.scrollElement.scrollTop;
    windowPosition += HEIGHT_APPBAR + EVENT_LIST_DATE_HEIGHT;
    console.log('Position of the item in the window', windowPosition);

    this.setState({ eventDetails: data });
    this.props.onSelectEvent(data.keyword);
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
