import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  List
} from 'react-virtualized';

import EventListItem from './EventListItem';
import EventListDate from './EventListDate';
// The loader aims to provide a state during react-virtualized calculation
// There is no SSR with react-virtualized as its need client dimension
import Loader from './Loader';

const EVENT_LIST_ITEM_HEIGHT = 73;
const EVENT_LIST_DATE_HEADER_HEIGHT = 49;
const PADDING_INDEX_LOAD_MORE = 2;

export default class EventList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      rendered: false,
      stickyDate: props.data[0].date
    };

    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowsRendered = this.onRowsRendered.bind(this);
    this.getRowHeight = this.getRowHeight.bind(this);
  }

  render() {
    const { data } = this.props;
    return (
      <div style={{ height: '100%' }}>
        {this.state.rendered ? (
          <EventListDate date={this.state.stickyDate} />
        ) : (
          <Loader />
        )}
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height - EVENT_LIST_DATE_HEADER_HEIGHT}
              rowCount={data.length + 1}
              rowHeight={this.getRowHeight}
              onRowsRendered={this.onRowsRendered}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  getRowHeight({ index }) {
    if (index === this.props.data.length) return 73;
    return index &&
      this.props.data[index].date !== this.props.data[index - 1].date
      ? 122
      : 73;
  }

  rowRenderer({ key, index, style, parent }) {
    const { data } = this.props;
    if (index === data.length)
      return (
        <div style={style} key={key}>
          <Loader />
        </div>
      );
    return (
      <div style={style} key={key}>
        {(index &&
          data[index].date != data[index - 1].date && (
            <EventListDate date={data[index].date} />
          )) ||
          null}
        <EventListItem data={data[index]} />
      </div>
    );
  }

  onRowsRendered({
    overscanStartIndex,
    overscanStopIndex,
    startIndex,
    stopIndex
  }) {
    if (stopIndex + PADDING_INDEX_LOAD_MORE === this.props.data.length) {
      if (!this.props.loading) this.props.onLoadMore();
    }
    this.setState({
      rendered: true,
      stickyDate: this.props.data[startIndex].date
    });
  }
}
