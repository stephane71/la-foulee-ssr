import css from 'styled-jsx/css';
import dynamic from 'next/dynamic';

const VirtualizedList = dynamic(import('./VirtualizedList'), {
  ssr: false,
  loading: () => null
});

import EventListDate from './EventListDate';
import Loader from './Loader';
import { ScrollElementContext } from './Layout';

import { getSpacing, BaseLineHeight } from '../styles-variables';
import { APP_BACKGROUND_COLOR } from '../colors';
import { HEIGHT_APPBAR, MAX_WIDTH } from '../enums';

// See EventListDate component: line height + 2 * vertical padding
const EVENT_LIST_DATE_HEIGHT = BaseLineHeight + 2 * getSpacing('m');

const style = css`
  .EventList {
    //padding-top: ${EVENT_LIST_DATE_HEIGHT}px;
    height: 100%;
  }

  .EventList-Loading {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: ${MAX_WIDTH}px;
    z-index: 10;
    background-color: transparent;
  }
`;

const FixedDateHeader = ({ date }) => (
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

class EventList extends React.PureComponent {
  static defaultProps = {
    loading: true
  };

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
    const { data, loading, scrollElement } = this.props;
    const { listRendered } = this.state;

    if (!data.length && !loading) return <div>{'Empty list !'}</div>;

    const showLoader = !listRendered || loading;
    if (scrollElement) {
      if (showLoader) {
        scrollElement.scrollTop = 0;
        scrollElement.classList.add('prevent-scroll');
      } else {
        scrollElement.classList.remove('prevent-scroll');
      }
    }

    return (
      <div className={'EventList'}>
        {showLoader && (
          <div className={'EventList-Loading'}>
            <Loader />
          </div>
        )}

        {/*this.state.listRendered && (
          <FixedDateHeader date={this.state.stickyDate} />
        )*/}

        <VirtualizedList
          scrollElement={scrollElement}
          data={data}
          onSelectEvent={this.handleEventSelection}
          onChangeStickyDate={this.handleStickyDate}
          onListRendered={this.handleListRendered}
        />

        <style jsx>{style}</style>
      </div>
    );
  }

  handleEventSelection(data, elementPosition) {
    // For transition
    // let windowPosition =
    //   elementPosition - this.context.scrollingElement.scrollTop;
    // windowPosition += HEIGHT_APPBAR + EVENT_LIST_DATE_HEIGHT;
    // console.log('Position of the item in the window', windowPosition);

    this.props.onSelectEvent(data);
  }

  handleStickyDate(stickyDate) {
    this.setState({ stickyDate });
  }

  handleListRendered() {
    this.setState({ listRendered: true });
  }
}

export default props => (
  <ScrollElementContext.Consumer>
    {scrollElement => <EventList {...props} scrollElement={scrollElement} />}
  </ScrollElementContext.Consumer>
);
