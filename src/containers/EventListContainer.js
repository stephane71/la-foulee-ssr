import { Fragment } from 'react';
import Head from 'next/head';
import css from 'styled-jsx/css';
import Media from 'react-media';

import Loader from '../components/Loader';
import EventList from '../components/EventList';

import { getEventListReducer } from '../utils/reducers';
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
  }

  state = {
    loading: false,
    selectors: DEFAULT_SELECTORS,
    events: this.props.eventListInitial || [],
    pages: this.props.pages
  };

  async componentDidMount() {
    if (!this.state.events.length) {
      this.setState({ loading: true });
      const eventList = await this.props.getEventList();
      this.setState({
        loading: false,
        events: getEventListReducer(eventList),
        pages: eventList.pages
      });
    }
  }

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

  async handleLoadPage() {
    if (this.state.loading) return;

    this.setState({ loading: true });

    const newSelectors = Object.assign({}, this.state.selectors, {
      page: this.state.selectors.page + 1
    });

    const eventList = await this.props.getEventList(newSelectors);
    this.setState(({ events }) => ({
      loading: false,
      selectors: newSelectors,
      events: events.concat(getEventListReducer(eventList))
    }));
  }

  getEventListComponent = () => {
    return (
      <div className={'EventListContainer'}>
        {!this.state.events.length && this.state.loading ? (
          <Loader />
        ) : (
          <EventList
            data={this.state.events}
            onLoadMore={this.handleLoadPage}
            loading={this.state.loading}
            endList={this.state.selectors.page + 1 === this.state.pages}
          />
        )}
        <style jsx>{`
          .EventListContainer {
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
}

export default EventListContainer;
