import { Fragment } from 'react';
import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  List,
  WindowScroller
} from 'react-virtualized';

import EventListItem from './EventListItem';
import EventListDate from './EventListDate';
import Loader from './Loader';

import { white, APP_BACKGROUND_COLOR } from '../colors';

const EVENT_LIST_ITEM_HEIGHT = 73;
const EVENT_LIST_DATE_HEADER_HEIGHT = 96;
const PADDING_INDEX_LOAD_MORE = 1; // should be minimum one

const cache = new CellMeasurerCache({
  defaultHeight: EVENT_LIST_ITEM_HEIGHT,
  fixedWidth: true
});

const BottomPageLoader = ({ loading }) => (
  <div className={`eventList-loader ${loading ? 'in' : 'out'}`}>
    <Loader />
    <style jsx>{`
      .eventList-loader {
        height: ${EVENT_LIST_ITEM_HEIGHT}px;
        position: fixed;
        bottom: -${EVENT_LIST_ITEM_HEIGHT}px;
        left: 0;
        width: 100%;
        transition: transform 0.2s ease-out;
        will-change: transform;
        background-color: ${white};
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

    this.getRowHeight = this.getRowHeight.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowsRendered = this.onRowsRendered.bind(this);
    this.onScrollList = this.onScrollList.bind(this);
  }

  state = {
    rendered: false,
    stickyDate: this.props.data.length && this.props.data[0].date
  };

  render() {
    const { data } = this.props;

    if (!data.length) return <div>{'Empty list !'}</div>;

    return (
      <Fragment>
        <div>
          <EventListDate date={this.state.stickyDate} />
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

        <WindowScroller>
          {({
            height,
            isScrolling,
            registerChild,
            onChildScroll,
            scrollTop
          }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  autoHeight
                  width={width}
                  height={height}
                  rowCount={data.length}
                  rowHeight={this.getRowHeight}
                  onRowsRendered={this.onRowsRendered}
                  rowRenderer={this.rowRenderer}
                  overscanRowCount={2}
                  onScroll={onChildScroll}
                  isScrolling={isScrolling}
                  scrollTop={scrollTop}
                  style={{
                    outline: 'none',
                    backgroundColor: `${APP_BACKGROUND_COLOR}`
                  }}
                  deferredMeasurementCache={cache}
                  rowHeight={cache.rowHeight}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>

        <BottomPageLoader loading={this.props.loading} />
      </Fragment>
    );
  }

  scrollTop = 0;

  onScrollList({ clientHeight, scrollHeight, scrollTop }) {
    this.props.isScrolling(scrollTop > this.scrollTop);
    this.scrollTop = scrollTop;
  }

  getRowHeight({ index }) {
    return index &&
      this.props.data[index].date !== this.props.data[index - 1].date
      ? EVENT_LIST_ITEM_HEIGHT + EVENT_LIST_DATE_HEADER_HEIGHT
      : EVENT_LIST_ITEM_HEIGHT;
  }

  rowRenderer({ key, index, style, parent }) {
    const { data } = this.props;

    let firstItemDay = index && data[index].date !== data[index - 1].date;
    let lastItemDay =
      data[index + 1] && data[index].date !== data[index + 1].date;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={{ ...style, top: style.top + index }}>
          {(firstItemDay && <EventListDate date={data[index].date} />) || null}
          <EventListItem
            data={data[index]}
            onSelectEvent={this.props.onSelectEvent}
            withBorderRadiusTop={index === 0 || firstItemDay}
            withBorderRadiusBottom={lastItemDay}
          />
        </div>
      </CellMeasurer>
    );
  }

  onRowsRendered({ startIndex, stopIndex }) {
    if (stopIndex + PADDING_INDEX_LOAD_MORE >= this.props.data.length) {
      if (!this.props.loading && !this.props.endList) this.props.onLoadMore();
    }
    this.setState({
      rendered: true,
      stickyDate: this.props.data[startIndex].date
    });
  }
}
