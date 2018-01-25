import Head from 'next/head';

import Layout from '../components/Layout';
import Loader from '../components/Loader';
import EventList from '../components/EventList';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

const getEventList = function(eventList) {
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

    if (!query.eventList) return { eventList: null };
    return { eventList: query.eventList };
  }

  constructor(props) {
    super(props);

    this.handleLoadPage = this.handleLoadPage.bind(this);
  }

  state = {
    loading: false,
    events: getEventList(this.props.eventList)
  };

  async componentDidMount() {
    if (!this.state.events.length) {
      this.setState({ loading: true });
      const events = await this.props.getEventList();
      this.setState({ loading: false, events: getEventList(events) });
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
          />
        )}
      </Layout>
    );
  }

  handleLoadPage() {
    if (this.state.loading) return;

    this.setState({ loading: true });
    setTimeout(() => {
      this.setState(({ events }) => ({
        loading: false,
        events: events.concat(getEventList(this.props.eventList))
      }));
    }, 3000);
  }
}

export default withCredentials(withEventAPI(Search));
