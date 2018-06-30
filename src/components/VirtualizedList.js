import { connect } from 'react-redux';
import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  List,
  WindowScroller
} from 'react-virtualized';

import EventListItem from './EventListItem';
import EventListDate from './EventListDate';
import EventListHeader from './EventListHeader';

import { setEventListStartIndex } from '../actions';

const cache = new CellMeasurerCache({
  fixedWidth: true
});

class VirtualizedList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.initPositionSet = false;
    this.renderingNewList = true;

    this.refList = this.refList.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowsRendered = this.onRowsRendered.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(setEventListStartIndex(this.scrollTop));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.renderingNewList = true;
      this.props.onListRendering(true);

      cache.clearAll();
    }
  }

  render() {
    const { scrollElement, data } = this.props;

    if (!data.length) return null;

    return (
      <WindowScroller
        scrollElement={scrollElement}
        onScroll={this.handleScroll}
      >
        {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => {
          if (!height) return null;
          return (
            <AutoSizer disableHeight>
              {({ width }) => {
                if (!width) return null;
                return (
                  <List
                    ref={this.refList}
                    autoHeight
                    width={width}
                    height={height}
                    rowCount={data.length}
                    rowHeight={cache.rowHeight}
                    onRowsRendered={this.onRowsRendered}
                    rowRenderer={this.rowRenderer}
                    overscanRowCount={2}
                    onScroll={onChildScroll}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                    deferredMeasurementCache={cache}
                    rowHeight={cache.rowHeight}
                    className={'VirtualizedList-List'}
                  />
                );
              }}
            </AutoSizer>
          );
        }}
      </WindowScroller>
    );
  }

  refList(list) {
    if (list && !this.initPositionSet) {
      list.scrollToPosition(this.props.initScrollPosition);
      this.initPositionSet = true;
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
          {!index && <EventListHeader nbItems={data.length} />}
          {firstItemDay && <EventListDate date={data[index].date} marginTop />}
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

  onRowsRendered() {
    if (this.renderingNewList) {
      this.renderingNewList = false;
      this.props.onListRendering(false);
    }
  }

  handleScroll({ scrollTop }) {
    this.scrollTop = scrollTop;
  }
}

function mapStateToProps(state) {
  return {
    initScrollPosition: state.eventListStartIndex
  };
}

export default connect(mapStateToProps)(VirtualizedList);
