import dynamic from 'next/dynamic';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';

import { makeStore } from '../store';

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
  let eventPageDisplay = props.url.query.event ? 'block' : 'none';
  let eventListDisplay = props.url.query.event ? 'none' : 'block';
  return (
    <Layout>
      <div style={{ height: '100%', display: `${eventPageDisplay}` }}>
        {props.url.query.event && <EventPageContainer {...props} />}
      </div>
      <div style={{ height: '100%', display: `${eventListDisplay}` }}>
        <EventListContainer {...props} />
      </div>
    </Layout>
  );
};

App.getInitialProps = function({ store, isServer, ...context }) {
  let { query } = context;

  if (query.event && query.event.title) return { event: query.event };
  if (query.eventList) {
    store.dispatch({
      type: 'CONCAT_EVENT_LIST',
      events: getEventListReducer(query.eventList)
    });
    store.dispatch({
      type: 'SET_EVENT_LIST_NB_PAGES',
      pages: query.eventList.pages
    });
  }

  return {};
};

export default compose(withRedux(makeStore), withCredentials, withEventAPI)(
  App
);
// export default withCredentials(withEventAPI(App));
