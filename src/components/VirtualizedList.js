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
const PADDING_INDEX_LOAD_MORE = 1; // should be minimum one
const NO_ITEM_SELECTED = null;

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

  state = {
    rendered: false
  };

  componentWillReceiveProps(nextProps) {
    // End loading more detection: pb -> will catch a refresh too.
    // IF the new list is longer than the previous one
    if (this.props.data.length < nextProps.data.length) {
      cache.clear(this.props.data.length - 1);
    }

    if (nextProps.closeSelectedEvent && this.selectedItem) {
      this.updateSelectedEvent(this.selectedItem);
    }
  }

  render() {
    return (
      <WindowScroller
        onScroll={this.props.onScroll}
        scrollElement={this.props.scrollElement}
      >
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
                className={'EventList'}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }

  firstRendering = false;
  listComponent = null;
  selectedItem = NO_ITEM_SELECTED;

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
        {index === data.length - 1 ? (
          <div
            className={'EventList-Item EventList-Item--loader'}
            style={{ ...style }}
          >
            <Loader />
          </div>
        ) : (
          <div style={{ ...style }}>
            {(firstItemDay && (
              <EventListDate date={data[index].date} marginTop />
            )) ||
              null}
            <EventListItem
              data={data[index]}
              onSelectEvent={data => this.onSelectEvent(index, data)}
              withBorderRadiusTop={index === 0 || firstItemDay}
              withBorderRadiusBottom={index + 1 === data.length || lastItemDay}
              showDetails={index === this.selectedItem}
            />
          </div>
        )}
      </CellMeasurer>
    );
  }

  onSelectEvent(index, data) {
    const selectedItem = this.updateSelectedEvent(index);
    this.props.onSelectEvent(
      selectedItem === NO_ITEM_SELECTED ? NO_ITEM_SELECTED : data.keyword
    );
  }

  onRowsRendered({ startIndex, stopIndex }) {
    if (stopIndex + PADDING_INDEX_LOAD_MORE >= this.props.data.length) {
      this.props.onReachEndList();
    }
    this.props.onChangeStickyDate(this.props.data[startIndex].date);
    if (!this.firstRendering) {
      this.firstRendering = true;
      this.props.onListRendered();
    }
  }

  updateSelectedEvent(index) {
    cache.clear(index);
    let selectedItem = index;

    if (this.selectedItem === index) {
      selectedItem = NO_ITEM_SELECTED;
    } else if (this.selectedItem !== NO_ITEM_SELECTED) {
      cache.clear(this.selectedItem);
    }

    this.selectedItem = selectedItem;
    // Will render the list; that why we don't need a state for selectedItem
    this.listComponent.recomputeRowHeights();

    return selectedItem;
  }
}
