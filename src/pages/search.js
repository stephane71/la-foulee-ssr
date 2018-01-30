import dynamic from 'next/dynamic';
import Head from 'next/head';

import Layout from '../components/Layout';

const EventListContainer = dynamic(import('../containers/EventListContainer'), {
  ssr: false
});

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

  render() {
    return (
      <Layout>
        <Head>
          <title>{`La Foulée | rechercher un evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventStructuredData()}
          </script>
        </Head>

        <EventListContainer
          pages={this.props.pages}
          eventListInitial={this.props.eventListInitial}
        />
      </Layout>
    );
  }
}

export default Search;
