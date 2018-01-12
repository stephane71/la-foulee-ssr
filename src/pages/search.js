import Layout from '../components/Layout';
import EventList from '../components/EventList';

const Search = props => (
  <Layout>
    {'Search pages test'}
    <EventList data={props.eventList.strides} />
  </Layout>
);

Search.getInitialProps = async function({ query }) {
  return { eventList: query.eventList };
};

export default Search;
