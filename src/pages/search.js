import Layout from '../components/Layout';
import EventList from '../components/EventList';

const Search = props => (
  <Layout>
    <EventList data={props.eventList.strides} />
  </Layout>
);

Search.getInitialProps = async function({ query }) {
  return { eventList: query.eventList };
};

export default Search;
