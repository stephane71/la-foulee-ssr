import dynamic from 'next/dynamic';
import Head from 'next/head';

import Layout from '../components/Layout';
import { getSearchStructuredData } from '../utils/structuredData';
import { getEventListReducer } from '../utils/reducers';

const EventListContainer = dynamic(import('../containers/EventListContainer'), {
  ssr: false
});

const Search = props => {
  return (
    <Layout>
      <Head>
        <title>{`La Foulée | rechercher un evénement`}</title>
        <script type={'application/ld+json'}>
          {getSearchStructuredData()}
        </script>
      </Head>

      <EventListContainer
        pages={props.pages}
        eventListInitial={props.eventListInitial}
      />
    </Layout>
  );
};

Search.getInitialProps = function(context) {
  let { query } = context;

  if (!query.eventList) return { eventListInitial: [] };
  return {
    eventListInitial: getEventListReducer(query.eventList),
    pages: query.eventList.pages
  };
};

export default Search;
