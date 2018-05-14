import VirtualizedList from './VirtualizedList';
import EventListDate from './EventListDate';
import Loader from './Loader';

import { getSpacing, BaseLineHeight } from '../styles-variables';
import { APP_BACKGROUND_COLOR } from '../colors';
import { HEIGHT_APPBAR, MAX_WIDTH } from '../enums';

// See EventListDate component: line height + 2 * vertical padding
const EVENT_LIST_DATE_HEIGHT = BaseLineHeight + 2 * getSpacing('m');

export default class EventList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      stickyDate: this.props.data.length && this.props.data[0].date,
      listRendered: false
    };

    this.handleStickyDate = this.handleStickyDate.bind(this);
    this.handleListRendered = this.handleListRendered.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
  }

  render() {
    const { data, event, desktop } = this.props;

    if (!data.length && !this.props.loading) return <div>{'Empty list !'}</div>;

    return (
      <div className={'EventList prevent-scroll'}>
        {(!this.state.listRendered || this.props.loading) && (
          <div className={'EventList-Loading'}>
            <Loader />
          </div>
        )}

        {this.state.listRendered && (
          <FixedDateHeader date={this.state.stickyDate} desktop={desktop} />
        )}

        <div ref={el => (this.scrollElement = el)} className={'prevent-scroll'}>
          <VirtualizedList
            scrollElement={this.scrollElement}
            data={this.props.data}
            onSelectEvent={this.handleEventSelection}
            onChangeStickyDate={this.handleStickyDate}
            onListRendered={this.handleListRendered}
          />
        </div>

        <style jsx>{`
          .EventList {
            padding-top: ${EVENT_LIST_DATE_HEIGHT}px;
            -webkit-overflow-scrolling: touch;
            outline: none;
            max-width: ${MAX_WIDTH}px;
            margin: 0 auto;
          }

          .EventList-Loading {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            max-width: ${MAX_WIDTH}px;
            z-index: 10;
            background-color: ${APP_BACKGROUND_COLOR};
          }
        `}</style>
      </div>
    );
  }

  handleEventSelection(data, elementPosition) {
    // For transition
    let windowPosition = elementPosition - this.scrollElement.scrollTop;
    windowPosition += HEIGHT_APPBAR + EVENT_LIST_DATE_HEIGHT;
    console.log('Position of the item in the window', windowPosition);

    this.props.onSelectEvent(data);
  }

  handleStickyDate(stickyDate) {
    this.setState({ stickyDate });
  }

  handleListRendered() {
    this.setState({ listRendered: true });
    this.props.onListRendered();
  }
}

const FixedDateHeader = ({ date, desktop }) => (
  <div className={'FixedDateHeader'}>
    <EventListDate date={date} />
    <style jsx>{`
      .FixedDateHeader {
        background-color: ${APP_BACKGROUND_COLOR};
        position: fixed;
        top: ${HEIGHT_APPBAR}px;
        left: 0;
        right: 0;
        max-width: ${MAX_WIDTH}px;
        margin: 0 auto;
        z-index: 2;
      }
    `}</style>
  </div>
);
