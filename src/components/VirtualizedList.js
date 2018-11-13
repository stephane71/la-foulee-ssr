import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  List,
  WindowScroller
} from "react-virtualized";

import EventListItem from "./EventListItem";
import EventListDate from "./EventListDate";
import EventListWeek from "./EventListWeek";
import EventListMonthBottom from "./EventListMonthBottom";

import { getSpacing } from "../styles-variables";

const cache = new CellMeasurerCache({
  fixedWidth: true
});

// 1 an et 6 mois = 76 semaines ou 18 mois
// (EventListWeek || EventListMonth) height = 48px
// EventListHeader height = 140px
const MIN_LIST_HEIGHT = 76 * 48 + 18 * 48 + 140;
// EventListItem height when title is on 2 lines (only the article tag)
const ITEM_MAX_HEIGHT = 96;

// Max height = every item on one date + min list height
const getListMaxHeight = nbItems =>
  nbItems * (ITEM_MAX_HEIGHT + 24 + 48) + MIN_LIST_HEIGHT;
const getAverageItemHeight = nbItems => getListMaxHeight(nbItems) / nbItems;
// (nbItems * ITEM_MAX_HEIGHT + MIN_LIST_HEIGHT) / nbItems;

class VirtualizedList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.initPositionSet = false;
    this.renderingNewList = true;
    this.list = null;
    // Find a maximun possible height for the list
    // This fix that problem:
    // - Select the last item in the list
    // - Route back to the list
    // => The list doesn't render the same state than previously
    // => Reason: the list height is < window.scrollY
    this.averageItemHeight = getAverageItemHeight(props.data.length);

    this.refList = this.refList.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowsRendered = this.onRowsRendered.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      window.scrollTo(0, 0);
      this.averageItemHeight = getAverageItemHeight(nextProps.data.length);
      this.renderingNewList = true;
      this.props.onListRendering(true);
      // Needed for List component to trigger a render
      cache.clearAll();
    }
  }

  render() {
    const { data } = this.props;

    if (!data.length) return null;

    return (
      <WindowScroller scrollElement={window}>
        {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => {
              return (
                <List
                  estimatedRowSize={this.averageItemHeight}
                  ref={this.refList}
                  autoHeight
                  width={width}
                  height={height}
                  rowCount={data.length}
                  rowHeight={cache.rowHeight}
                  onRowsRendered={this.onRowsRendered}
                  rowRenderer={this.rowRenderer}
                  overscanRowCount={2}
                  deferredMeasurementCache={cache}
                  rowHeight={cache.rowHeight}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  className={"VirtualizedList-List"}
                />
              );
            }}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }

  refList(list) {
    if (list && !this.initPositionSet) {
      this.initPositionSet = true;
      this.list = list;
    }
  }

  rowRenderer({ key, index, style, parent }) {
    const { data } = this.props;

    const firstItemDay = !index || data[index].date !== data[index - 1].date;
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
          {firstItemDay && (
            <div style={{ padding: getSpacing("m") }}>
              <EventListWeek data={data} index={index} />
              <EventListDate date={data[index].date} />
            </div>
          )}
          <EventListItem
            data={data[index]}
            onSelectEvent={data => this.onSelectEvent(data, style.top)}
            withBorderRadiusTop={index === 0 || firstItemDay}
            withBorderRadiusBottom={index + 1 === data.length || lastItemDay}
          />
          {lastItemDay && <EventListMonthBottom data={data} index={index} />}
        </div>
      </CellMeasurer>
    );
  }

  onSelectEvent(data, position) {
    this.props.onSelectEvent(data, position);
  }

  onRowsRendered() {
    if (this.renderingNewList) {
      this.renderingNewList = false;
      this.props.onListRendering(false);

      if (this.list) {
        this.list.forceUpdate();
      }
    }
  }
}

export default VirtualizedList;
