import css from 'styled-jsx/css';
import dynamic from 'next/dynamic';

const VirtualizedList = dynamic(import('./VirtualizedList'), {
  ssr: false,
  loading: () => null
});

import Loader from './Loader';
import { ScrollElementContext } from './Layout';

import { getSpacing, BaseLineHeight } from '../styles-variables';
import { HEIGHT_APPBAR, MAX_WIDTH } from '../enums';

// See EventListDate component: line height + 2 * vertical padding
const EVENT_LIST_DATE_HEIGHT = BaseLineHeight + 2 * getSpacing('m');

const style = css`
  .EventList {
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

class EventList extends React.PureComponent {
  static defaultProps = {
    loading: true
  };

  constructor(props) {
    super(props);

    this.state = {
      listRendered: false
    };

    this.handleListRendered = this.handleListRendered.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
  }

  render() {
    const { data, loading, scrollElement } = this.props;
    const { listRendered } = this.state;

    if (!data.length && !loading) return <div>{'Empty list !'}</div>;

    const showLoader = !listRendered || loading;
    if (scrollElement) {
      scrollElement.scrollTop = 0;
      showLoader
        ? scrollElement.classList.add('prevent-scroll')
        : scrollElement.classList.remove('prevent-scroll');
    }

    return (
      <div className={'EventList'}>
        {showLoader && (
          <div className={'EventList-Loading'}>
            <Loader />
          </div>
        )}

        <VirtualizedList
          scrollElement={scrollElement}
          data={data}
          onSelectEvent={this.handleEventSelection}
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

  handleListRendered() {
    this.setState({ listRendered: true });
  }
}

export default props => (
  <ScrollElementContext.Consumer>
    {scrollElement => <EventList {...props} scrollElement={scrollElement} />}
  </ScrollElementContext.Consumer>
);
