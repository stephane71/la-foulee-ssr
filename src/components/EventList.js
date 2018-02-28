import debounce from 'lodash.debounce';

import VirtualizedList from './VirtualizedList';
import EventListItem from './EventListItem';
import EventListDate from './EventListDate';
import Loader from './Loader';

import { APP_BACKGROUND_COLOR } from '../colors';
import { HEIGHT_MOBILE_SEARCH_INPUT } from '../enums';
import { getSpacing } from '../styles-variables';

const EVENT_LIST_ITEM_HEIGHT = 72;

import FilterContainer from '../containers/FilterContainer';

const FiltersWrapper = ({ show }) => (
  <div className={`filterWrapper ${show ? '' : 'out'}`}>
    <FilterContainer />
    <style jsx>{`
      .filterWrapper {
        position: fixed;
        bottom: ${getSpacing('s')}px;
        left: 0;
        right: 0;
        padding: 0 ${getSpacing('s')}px;
        transition: transform 0.3s ease-out;
        will-change: transform;
        z-index: 2;
      }

      .out {
        transform: translateY(100%);
      }
    `}</style>
  </div>
);

const StickyDateHeader = ({ date }) => (
  <div>
    <EventListDate date={date} />
    <style jsx>{`
      div {
        background-color: ${APP_BACKGROUND_COLOR};
        position: sticky;
        top: 56px;
        left: 0;
        width: 100%;
        z-index: 1;
      }
    `}</style>
  </div>
);

const BottomPageLoader = ({ loading }) => (
  <div className={`eventList-loader ${loading ? 'in' : 'out'}`}>
    <Loader />
    <style jsx>{`
      .eventList-loader {
        height: ${EVENT_LIST_ITEM_HEIGHT}px;
        position: absolute;
        bottom: -${EVENT_LIST_ITEM_HEIGHT}px;
        left: 0;
        width: 100%;
        transition: transform 0.2s ease-out;
        will-change: transform;
      }

      .in {
        transform: translateY(-100%);
      }

      .out {
        transform: translateY(0);
      }
    `}</style>
  </div>
);

export default class EventList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    // This debounce fix a pb with the scroll top value:
    // When reach the end a page: onLoadMore
    // The scrollTop value returned by the VirtualizedList decrease
    // Because of that we detect a false scrollTop and the MobileInput appears!
    // This technic prevent this behaviour
    // this.handleScroll = debounce(this.handleScroll, 50);

    this.handleStickyDate = this.handleStickyDate.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  state = {
    stickyDate: this.props.data.length && this.props.data[0].date,
    scrollUp: true,
    offsetScroll: true
  };

  render() {
    const { data } = this.props;

    if (!data.length) return <div>{'Empty list !'}</div>;

    return (
      <div>
        {/* <FiltersWrapper show={this.state.scrollUp || this.state.offsetScroll} /> */}
        <FiltersWrapper show />

        <StickyDateHeader date={this.state.stickyDate} />

        <VirtualizedList
          data={this.props.data}
          onSelectEvent={this.props.onSelectEvent}
          onChangeStickyDate={this.handleStickyDate}
          onReachEndList={this.handleLoadMore}
          onScroll={this.handleScroll}
        />

        {/* <BottomPageLoader loading={this.props.loading} /> */}
      </div>
    );
  }

  scrollTop = 0;
  windowScrollTop = 0;

  handleScroll({ scrollTop }) {
    // tester de comperer avec window.scrollY
    // const windowScrollUp = this.windowScrollTop > window.scrollY;
    // console.log(this.windowScrollTop, window.scrollY, windowScrollUp);
    // this.windowScrollTop = window.scrollY;

    // console.log(this.scrollTop, scrollTop, this.scrollTop > scrollTop);

    const scrollUp = this.scrollTop > scrollTop;
    this.scrollTop = scrollTop;
    this.setState({ scrollUp, offsetScroll: !scrollTop });
  }

  handleStickyDate(stickyDate) {
    this.setState({ stickyDate });
  }

  handleLoadMore() {
    if (!this.props.loading) this.props.onLoadMore();
  }
}
