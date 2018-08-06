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
    this.list = null;

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
      // Reset position => scroll to top
      this.props.dispatch(setEventListStartIndex(0));
      this.list.scrollToPosition(0);
      // Inform parent we are rendering
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
      <AutoSizer>
        {({ width, height }) => {
          if (!width) return null;
          return (
            <List
              ref={this.refList}
              width={width}
              height={height}
              rowCount={data.length}
              rowHeight={cache.rowHeight}
              onRowsRendered={this.onRowsRendered}
              rowRenderer={this.rowRenderer}
              overscanRowCount={2}
              onScroll={this.handleScroll}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              className={'VirtualizedList-List'}
            />
          );
        }}
      </AutoSizer>
    );
  }

  refList(list) {
    if (list && !this.initPositionSet) {
      list.scrollToPosition(this.props.initScrollPosition);
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
