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

const cache = new CellMeasurerCache({
  defaultHeight: 73,
  fixedWidth: true
});

const EVENT_LIST_ITEM_HEIGHT = 73;
const EVENT_LIST_DATE_HEADER_HEIGHT = 49;

export default class EventList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      stickyDate: props.data[0].date,
      rendered: false
    };

    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowsRendered = this.onRowsRendered.bind(this);
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
              rowCount={data.length}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              onRowsRendered={this.onRowsRendered}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  rowRenderer({ key, index, style, parent }) {
    const { data } = this.props;
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={style} key={key}>
          {(index &&
            data[index].date != data[index - 1].date && (
              <EventListDate date={data[index].date} />
            )) ||
            ''}
          <EventListItem data={data[index]} />
        </div>
      </CellMeasurer>
    );
  }

  onRowsRendered({
    overscanStartIndex,
    overscanStopIndex,
    startIndex,
    stopIndex
  }) {
    this.setState({
      rendered: true,
      stickyDate: this.props.data[startIndex].date
    });
  }
}
