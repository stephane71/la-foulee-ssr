import Router from 'next/router';
import dynamic from 'next/dynamic';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';

import { makeStore } from '../store';
import {
  setSelectedEvent,
  concatEventList,
  setEventListNbPages
} from '../actions';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

import Layout from '../components/Layout';
import Loader from '../components/Loader';

import { getFormatEventList } from '../utils/apiProxy';

let EventListContainer_LOADED = false;
Router.onRouteChangeComplete = url => {
  if (url === '/search') EventListContainer_LOADED = true;
};

const EventPageContainer = dynamic(import('../containers/EventPageContainer'), {
  ssr: true,
  loading: () => <Loader />
});

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
        {(props.url.asPath === '/search' || EventListContainer_LOADED) && (
          <EventListContainer {...props} />
        )}
      </div>
    </Layout>
  );
};

App.getInitialProps = function({ store, isServer, ...context }) {
  let { query } = context;

  if (isServer) {
    if (query.event && query.event.title)
      store.dispatch(setSelectedEvent(query.event));

    if (query.eventList) {
      const { events, pages } = getFormatEventList(query.eventList);

      store.dispatch(concatEventList(events));
      store.dispatch(setEventListNbPages(pages));
    }
  }

  return {};
};

export default compose(withRedux(makeStore), withCredentials, withEventAPI)(
  App
);
