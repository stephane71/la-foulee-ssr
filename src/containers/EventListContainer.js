import { Fragment } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import css from 'styled-jsx/css';
import Media from 'react-media';

import {
  setSelectedEvent,
  concatEventList,
  setEventListNbPages
} from '../actions';

import Loader from '../components/Loader';
import EventList from '../components/EventList';

import { getFormatEventList } from '../utils/apiProxy';
import { getEventListStructuredData } from '../utils/structuredData';

import { listBorderColor } from '../colors';

const DEFAULT_SELECTORS = {
  month: '0-2018',
  dep: '',
  page: 0
};

const EventListContainerDesktop = css`
  .EventListContainerDesktop {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .EventListContainerDesktop--selectors {
    height: 100%;
    width: 40%;
  }

  .EventListContainerDesktop--list {
    height: 100%;
    width: 60%;
  }
`;

export class EventListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleLoadPage = this.handleLoadPage.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
  }

  state = {
    loading: false,
    selectors: DEFAULT_SELECTORS
  };

  // When sould we need this hook ?
  // Container is rendered with server data in props on first load
  // Then it's never unmount
  // -> When assets will be cache in client side
  // async componentDidMount() {
  // }

  render() {
    return (
      <Fragment>
        <Head>
          <title>{`La Foulée | rechercher un evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventListStructuredData()}
          </script>
        </Head>
        <Media query={`(max-width: 768px)`}>
          {matches =>
            matches ? (
              this.getEventListComponent()
            ) : (
              <div className={'EventListContainerDesktop'}>
                <div className={'EventListContainerDesktop--selectors'}>
                  {'Selectors'}
                </div>
                <div className={'EventListContainerDesktop--list'}>
                  {this.getEventListComponent()}
                </div>
                <style jsx>{EventListContainerDesktop}</style>
              </div>
            )
          }
        </Media>
      </Fragment>
    );
  }

  getEventListComponent = () => {
    return (
      <div className={'EventListComponent'}>
        {!this.props.events.length && this.state.loading ? (
          <Loader />
        ) : (
          <EventList
            data={this.props.events}
            onLoadMore={this.handleLoadPage}
            loading={this.state.loading}
            endList={this.state.selectors.page + 1 === this.props.pages}
            onSelectEvent={this.handleEventSelection}
          />
        )}
        <style jsx>{`
          .EventListComponent {
            margin: auto;
            max-width: 768px;
            height: 100%;
            border-right: 1px solid ${listBorderColor};
            border-left: 1px solid ${listBorderColor};
          }
        `}</style>
      </div>
    );
  };

  async handleLoadPage() {
    if (this.state.loading) return;

    const newSelectors = Object.assign({}, this.state.selectors, {
      page: this.state.selectors.page + 1
    });

    this.setState(({ events }) => ({ loading: true, selectors: newSelectors }));

    const eventList = await this.props.getEventList(newSelectors);
    const { events } = getFormatEventList(eventList);
    this.props.dispatch(concatEventList(events));

    this.setState({ loading: false });
  }

  handleEventSelection(event) {
    this.props.dispatch(setSelectedEvent(event));
    Router.push(
      {
        pathname: '/app',
        query: { event: event.keyword }
      },
      `/event/${event.keyword}`
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    pages: state.pages
  };
}

export default connect(mapStateToProps)(EventListContainer);
