import Head from 'next/head';

import Layout from '../components/Layout';
import Loader from '../components/Loader';
import EventList from '../components/EventList';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

const DEFAULT_SELECTORS = {
  month: '0-2018',
  dep: '',
  page: 0
};

const getEventListReducer = function(eventList) {
  return eventList
    ? eventList.strides.reduce(
        (current, next) => (current = current.concat(next)),
        []
      )
    : [];
};

const getEventStructuredData = function(event) {
  const jsonLD = {};
  return JSON.stringify(jsonLD);
};

export class Search extends React.PureComponent {
  static getInitialProps(context) {
    let { query } = context;

    if (!query.eventList) return { eventListInitial: [] };
    return {
      eventListInitial: getEventListReducer(query.eventList),
      pages: query.eventList.pages
    };
  }

  constructor(props) {
    super(props);

    this.handleLoadPage = this.handleLoadPage.bind(this);
  }

  state = {
    loading: false,
    selectors: DEFAULT_SELECTORS,
    events: this.props.eventListInitial,
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
      <Layout>
        <Head>
          <title>{`La Foulée | rechercher un evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventStructuredData()}
          </script>
        </Head>

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
      </Layout>
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
}

export default withCredentials(withEventAPI(Search));
