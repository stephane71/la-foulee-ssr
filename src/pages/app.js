import dynamic from 'next/dynamic';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

import Layout from '../components/Layout';
import Loader from '../components/Loader';

import { getEventListReducer } from '../utils/reducers';

import EventPageContainer from '../containers/EventPageContainer';
const EventListContainer = dynamic(import('../containers/EventListContainer'), {
  ssr: false,
  loading: () => <Loader />
});

const App = props => {
  return (
    <Layout>
      {props.url.query.event ? (
        <EventPageContainer {...props} />
      ) : (
        <EventListContainer {...props} />
      )}
    </Layout>
  );
};

App.getInitialProps = function(context) {
  let { query } = context;

  if (query.event && query.event.title) return { event: query.event };
  if (query.eventList)
    return {
      eventListInitial: getEventListReducer(query.eventList),
      pages: query.eventList.pages
    };

  return {};
};

export default withCredentials(withEventAPI(App));
