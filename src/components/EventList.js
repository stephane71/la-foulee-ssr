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
        padding: 0 ${getSpacing('xs')}px;
        transition: transform 0.3s ease-out;
        will-change: transform;
        z-index: 2;
      }

      .out {
        transform: translateY(calc(100% + ${getSpacing('s')}px));
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

// This offset prevent the page to stand on bottom:
// When reach the page bottom, new data are loaded
// Then the page reach automaticaly the end
// Then a new data load is triggering...
const LOADER_OFFSET_HEIGHT = 1;
const EventListLoader = ({ show }) => (
  <div className={`eventListLoader ${show ? 'in' : ''}`}>
    <Loader />
    <style jsx>{`
      .eventListLoader {
        height: ${EVENT_LIST_ITEM_HEIGHT + LOADER_OFFSET_HEIGHT}px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        visibility: hidden;
      }

      .in {
        visibility: visible;
        height: ${EVENT_LIST_ITEM_HEIGHT}px;
      }
    `}</style>
  </div>
);

export default class EventList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.handleStickyDate = this.handleStickyDate.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  state = {
    stickyDate: this.props.data.length && this.props.data[0].date,
    scrollDown: true
  };

  render() {
    const { data } = this.props;

    if (!data.length) return <div>{'Empty list !'}</div>;

    return (
      <div>
        <FiltersWrapper show={this.state.scrollDown} />

        <StickyDateHeader date={this.state.stickyDate} />

        <VirtualizedList
          data={this.props.data}
          onSelectEvent={this.props.onSelectEvent}
          onChangeStickyDate={this.handleStickyDate}
          onReachEndList={this.handleLoadMore}
          onScroll={this.handleScroll}
        />

        <EventListLoader show={this.props.loading} />
      </div>
    );
  }

  scrollTop = 0;

  handleScroll({ scrollTop }) {
    const scrollDown = this.scrollTop > scrollTop;
    this.scrollTop = scrollTop;
    this.setState({ scrollDown });
  }

  handleStickyDate(stickyDate) {
    this.setState({ stickyDate });
  }

  handleLoadMore() {
    if (!this.props.loading) this.props.onLoadMore();
  }
}
