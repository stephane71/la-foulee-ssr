import css from 'styled-jsx/css';
import dynamic from 'next/dynamic';

import VirtualizedList from './VirtualizedList';

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

class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listRendering: true
    };

    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleListRendering = this.handleListRendering.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && this.props.loading) {
      this.props.scrollElement.scrollTop = 0;
    }
  }

  render() {
    const { data, loading, scrollElement } = this.props;
    const { listRendering } = this.state;

    const showLoader = listRendering || loading;

    if (scrollElement) {
      if (showLoader) {
        scrollElement.classList.add('prevent-scroll');
      } else {
        scrollElement.classList.remove('prevent-scroll');
      }
    }

    if (!data.length && !showLoader)
      return <div>{`Aucun événements n'a été trouvé :(`}</div>;

    return (
      <div className={'EventList'}>
        {showLoader && (
          <div className={'EventList-Loading'}>
            <Loader />
          </div>
        )}

        {scrollElement && (
          <VirtualizedList
            scrollElement={scrollElement}
            data={data}
            onSelectEvent={this.handleEventSelection}
            onListRendering={this.handleListRendering}
          />
        )}

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

  handleListRendering(rendering) {
    this.setState({ listRendering: rendering });
  }
}

export default props => (
  <ScrollElementContext.Consumer>
    {scrollElement => <EventList {...props} scrollElement={scrollElement} />}
  </ScrollElementContext.Consumer>
);
