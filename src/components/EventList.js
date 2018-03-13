import { Fragment } from 'react';
import FilterContainer from '../containers/FilterContainer';

import VirtualizedList from './VirtualizedList';
import EventListItem from './EventListItem';
import EventListDate from './EventListDate';
import Loader from './Loader';

import { getSpacing, BaseLineHeight, Base } from '../styles-variables';
import { APP_BACKGROUND_COLOR, tonic } from '../colors';
import { HEIGHT_APPBAR } from '../enums';

// See EventListDate component: line height + 2 * vertical padding
const EVENT_LIST_DATE_HEIGHT = BaseLineHeight + 2 * getSpacing('m');

let lockFilters = false;
const FixedFiltersFooter = ({ show }) => (
  <div className={`FixedFiltersFooter ${show || lockFilters ? '' : 'out'}`}>
    <FilterContainer onFilterOpen={open => (lockFilters = open)} />
    <style jsx>{`
      .FixedFiltersFooter {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 ${getSpacing('xs')}px;
        padding-bottom: ${getSpacing('s')}px;
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
      listRendered: false
    };

    this.handleStickyDate = this.handleStickyDate.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleListRendered = this.handleListRendered.bind(this);
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
      <div
        ref={el => {
          this.scrollElement = el;
        }}
        className={'EventList prevent-scroll'}
      >
        {this.state.listRendered && (
          <FixedDateHeader date={this.state.stickyDate} />
        )}

        <VirtualizedList
          scrollElement={this.scrollElement}
          data={this.props.data}
          onSelectEvent={this.props.onSelectEvent}
          onChangeStickyDate={this.handleStickyDate}
          onReachEndList={this.handleLoadMore}
          onScroll={this.handleScroll}
          onListRendered={this.handleListRendered}
        />

        {this.state.listRendered && (
          <FixedFiltersFooter show={this.state.scrollUp} />
        )}

        {!this.state.listRendered && (
          <div className={'EventList-rendering'}>
            <Loader />
          </div>
        )}

        <style jsx>{`
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
