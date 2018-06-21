import { connect } from 'react-redux';
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
import EventListHeader from './EventListHeader';

import { setEventListStartIndex } from '../actions';

const DEFAULT_LIST_HEIGHT = 300;

const cache = new CellMeasurerCache({
  fixedWidth: true
});

class VirtualizedList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      listComponent: null
    };

    this.firstRendering = true;
    this.scrollTop = props.eventListStartIndex;

    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowsRendered = this.onRowsRendered.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(setEventListStartIndex(this.scrollTop));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.listComponent && this.scrollTop) {
      this.state.listComponent.scrollToPosition(this.scrollTop);
      this.scrollTop = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      cache.clearAll();
    }
  }

  render() {
    return (
      <WindowScroller
        scrollElement={this.props.scrollElement}
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
                    ref={el => {
                      if (el) this.setState({ listComponent: el });
                    }}
                    autoHeight
                    width={width}
                    height={height || DEFAULT_LIST_HEIGHT}
                    rowCount={this.props.data.length}
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

  onRowsRendered({ startIndex, stopIndex }) {
    if (this.firstRendering) {
      this.firstRendering = false;
      this.props.onListRendered();
    }
  }

  handleScroll({ scrollTop }) {
    this.scrollTop = scrollTop;
  }
}

function mapStateToProps(state) {
  return {
    eventListStartIndex: state.eventListStartIndex
  };
}

export default connect(mapStateToProps)(VirtualizedList);
