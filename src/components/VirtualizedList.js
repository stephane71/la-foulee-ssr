import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  List,
  WindowScroller
} from 'react-virtualized';

import EventListItem from './EventListItem';
import EventListDate from './EventListDate';

import { APP_BACKGROUND_COLOR } from '../colors';
import { getSpacing } from '../styles-variables';

const EVENT_LIST_ITEM_HEIGHT = 72;
const EVENT_LIST_DATE_HEADER_HEIGHT = 96;
const PADDING_INDEX_LOAD_MORE = 1; // should be minimum one

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

  render() {
    return (
      <WindowScroller onScroll={this.props.onScroll}>
        {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
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
                style={{
                  outline: 'none',
                  backgroundColor: `${APP_BACKGROUND_COLOR}`,
                  paddingBottom: `${getSpacing('xl')}px`
                }}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }

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
        <div style={{ ...style, paddingBottom: 1 }}>
          {(firstItemDay && <EventListDate date={data[index].date} />) || null}
          <EventListItem
            data={data[index]}
            onSelectEvent={this.props.onSelectEvent}
            withBorderRadiusTop={index === 0 || firstItemDay}
            withBorderRadiusBottom={index + 1 === data.length || lastItemDay}
          />
        </div>
      </CellMeasurer>
    );
  }

  onRowsRendered({ startIndex, stopIndex }) {
    if (stopIndex + PADDING_INDEX_LOAD_MORE >= this.props.data.length) {
      this.props.onReachEndList();
    }
    this.props.onChangeStickyDate(this.props.data[startIndex + 1].date);
    this.setState({ rendered: true });
  }
}
