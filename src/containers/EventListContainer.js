import { Fragment } from 'react';
import { connect } from 'react-redux';
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
    selectors: DEFAULT_SELECTORS
  };

  async componentDidMount() {
    if (!this.props.events.length) {
      this.setState({ loading: true });
      const eventList = await this.props.getEventList();
      this.setState({
        loading: false
      });
      this.props.dispatch({
        type: 'CONCAT_EVENT_LIST',
        events: getEventListReducer(eventList)
      });
      this.props.dispatch({
        type: 'SET_EVENT_LIST_NB_PAGES',
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

    this.props.dispatch({
      type: 'CONCAT_EVENT_LIST',
      events: getEventListReducer(eventList)
    });

    this.setState(({ events }) => ({
      loading: false,
      selectors: newSelectors
    }));
  }

  getEventListComponent = () => {
    console.log(this.props);
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
}

function mapStateToProps(state) {
  return {
    events: state.events,
    pages: state.pages
  };
}

export default connect(mapStateToProps)(EventListContainer);
