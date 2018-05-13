import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  List,
  WindowScroller
} from 'react-virtualized';

import Loader from './Loader';
import EventListItem from './EventListItem';
import EventListDate from './EventListDate';

const EVENT_LIST_ITEM_HEIGHT = 72;
const EVENT_LIST_DATE_HEADER_HEIGHT = 96;

const cache = new CellMeasurerCache({
  defaultHeight: EVENT_LIST_ITEM_HEIGHT,
  fixedWidth: true
});

export default class VirtualizedList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getRowHeight = this.getRowHeight.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowsRendered = this.onRowsRendered.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      cache.clearAll();
    }
  }

  render() {
    return (
      <WindowScroller scrollElement={this.props.scrollElement}>
        {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                ref={el => {
                  this.listComponent = el;
                }}
                autoHeight
                width={width}
                height={height}
                rowCount={this.props.data.length}
                rowHeight={this.getRowHeight}
                onRowsRendered={this.onRowsRendered}
                rowRenderer={this.rowRenderer}
                overscanRowCount={2}
                onScroll={onChildScroll}
                isScrolling={isScrolling}
                scrollTop={scrollTop}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                scrollToIndex={0}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }

  firstRendering = true;
  listComponent = null;

  getRowHeight({ index }) {
    return index &&
      this.props.data[index].date !== this.props.data[index - 1].date
      ? EVENT_LIST_ITEM_HEIGHT + EVENT_LIST_DATE_HEADER_HEIGHT
      : EVENT_LIST_ITEM_HEIGHT;
  }

  rowRenderer({ key, index, style, parent }) {
    const { data } = this.props;

    const firstItemDay = index && data[index].date !== data[index - 1].date;
    const lastItemDay =
      data[index + 1] && data[index].date !== data[index + 1].date;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={{ ...style }}>
          {(firstItemDay && (
            <EventListDate date={data[index].date} marginTop />
          )) ||
            null}
          <EventListItem
            data={data[index]}
            onSelectEvent={data => this.onSelectEvent(data, style.top)}
            withBorderRadiusTop={index === 0 || firstItemDay}
            withBorderRadiusBottom={index + 1 === data.length || lastItemDay}
          />
        </div>
      </CellMeasurer>
    );
  }

  onSelectEvent(data, position) {
    this.props.onSelectEvent(data, position);
  }

  onRowsRendered({ startIndex, stopIndex }) {
    this.props.onChangeStickyDate(this.props.data[startIndex].date);
    if (this.firstRendering) {
      this.firstRendering = false;
      this.props.onListRendered();
    }
  }
}
