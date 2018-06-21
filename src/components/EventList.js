import css from 'styled-jsx/css';
import dynamic from 'next/dynamic';

const VirtualizedList = dynamic(import('./VirtualizedList'), {
  ssr: false,
  loading: () => null
});

import EventListDate from './EventListDate';
import Loader from './Loader';
import { ScrollElementContext, SelectedCityContext } from './Layout';

import { getSpacing, BaseLineHeight } from '../styles-variables';
import { APP_BACKGROUND_COLOR, dominant, white } from '../colors';
import { HEIGHT_APPBAR, MAX_WIDTH, BORDER_RADIUS_LIST_ITEM } from '../enums';

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

  .EventList-Header {
    margin: ${getSpacing('s')}px;
    padding: ${getSpacing('m')}px ${getSpacing('s')}px;
    border-radius: ${BORDER_RADIUS_LIST_ITEM}px;
    background-color: ${dominant};
    color: ${white};
  }

  .EventList-HeaderTitle {
    margin: ${getSpacing('s')}px 0;
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
    const { data, loading, scrollElement, city } = this.props;
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

        {listRendered &&
          city && (
            <div className={'EventList-Header'}>
              <h1 className={'EventList-HeaderTitle'}>{city.name}</h1>
              <div>{`${data.length} événements autour de ${city.name}`}</div>
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
  <SelectedCityContext.Consumer>
    {city => (
      <ScrollElementContext.Consumer>
        {scrollElement => (
          <EventList {...props} scrollElement={scrollElement} city={city} />
        )}
      </ScrollElementContext.Consumer>
    )}
  </SelectedCityContext.Consumer>
);
