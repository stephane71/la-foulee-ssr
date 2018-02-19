import VirtualizedList from './VirtualizedList';

import EventListItem from './EventListItem';
import EventListDate from './EventListDate';
import Loader from './Loader';

import MobileInput from './MobileInput';

import { APP_BACKGROUND_COLOR } from '../colors';
import { HEIGHT_MOBILE_SEARCH_INPUT } from '../enums';

const EVENT_LIST_ITEM_HEIGHT = 72;

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

    this.onScrollList = this.onScrollList.bind(this);
    this.handleStickyDate = this.handleStickyDate.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  state = {
    stickyDate: this.props.data.length && this.props.data[0].date
  };

  render() {
    const { data } = this.props;

    if (!data.length) return <div>{'Empty list !'}</div>;

    return (
      <div className={'EventListComponent'}>
        {/* <MobileInput /> */}

        <StickyDateHeader date={this.state.stickyDate} />

        <VirtualizedList
          data={this.props.data}
          onSelectEvent={this.props.onSelectEvent}
          onChangeStickyDate={this.handleStickyDate}
          onReachEndList={this.handleLoadMore}
        />

        <BottomPageLoader loading={this.props.loading} />

        <style jsx>{`
          .EventListComponent {
            padding-top: ${HEIGHT_MOBILE_SEARCH_INPUT}px;
          }
        `}</style>
      </div>
    );
  }

  scrollTop = 0;

  onScrollList({ scrollTop, scrollLeft }) {
    console.log(scrollLeft, scrollTop);
  }

  handleStickyDate(stickyDate) {
    this.setState({ stickyDate });
  }

  handleLoadMore() {
    if (!this.props.loading && !this.props.endList) this.props.onLoadMore();
  }
}
