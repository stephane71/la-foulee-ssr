import Head from 'next/head';

import Layout from '../components/Layout';
import EventList from '../components/EventList';
import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

const getEventStructuredData = function(event) {
  const jsonLD = {};
  return JSON.stringify(jsonLD);
};

export class Search extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleLoadPage = this.handleLoadPage.bind(this);
  }

  static getInitialProps({ query }) {
    if (!query.eventList) return { eventList: { strides: [] } };
    return { eventList: query.eventList };
  }

  state = {
    loading: false,
    events: this.props.eventList.strides.reduce(
      (current, next) => (current = current.concat(next)),
      []
    )
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>{`La Foulée | rechercher un evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventStructuredData()}
          </script>
        </Head>

        <EventList
          data={this.state.events}
          onLoadMore={this.handleLoadPage}
          loading={this.state.loading}
        />
      </Layout>
    );
  }

  handleLoadPage() {
    if (this.state.loading) return;

    this.setState({ loading: true });
    setTimeout(() => {
      this.setState(({ events }) => ({
        loading: false,
        events: events.concat(
          this.props.eventList.strides.reduce(
            (current, next) => (current = current.concat(next)),
            []
          )
        )
      }));
    }, 3000);
  }
}

export default withCredentials(withEventAPI(Search));
