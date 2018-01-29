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

    this.getRowHeight = this.getRowHeight.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowsRendered = this.onRowsRendered.bind(this);
  }

  state = {
    rendered: false,
    stickyDate: this.props.data.length && this.props.data[0].date
  };

  render() {
    const { data } = this.props;

    if (!data.length) return <div>{'Empty list !'}</div>;

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
              rowCount={data.length}
              rowHeight={this.getRowHeight}
              onRowsRendered={this.onRowsRendered}
              rowRenderer={this.rowRenderer}
              style={{ outline: 'none' }}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  getRowHeight({ index }) {
    if (index === this.props.data.length) return EVENT_LIST_ITEM_HEIGHT;
    return index &&
      this.props.data[index].date !== this.props.data[index - 1].date
      ? EVENT_LIST_ITEM_HEIGHT + EVENT_LIST_DATE_HEADER_HEIGHT
      : EVENT_LIST_ITEM_HEIGHT;
  }

  rowRenderer({ key, index, style }) {
    const { data } = this.props;

    return (
      <div style={style} key={key}>
        {(index &&
          data[index].date != data[index - 1].date && (
            <EventListDate date={data[index].date} />
          )) ||
          null}

        {index === data.length - 1 && this.props.loading ? (
          <Loader />
        ) : (
          <EventListItem data={data[index]} />
        )}
      </div>
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
