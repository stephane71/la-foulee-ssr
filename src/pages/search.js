import Layout from '../components/Layout';
import EventListItem from '../components/EventListItem';

const mockItemData = {
  title: `L'arverne run  -  nocturne`,
  dep: '63',
  city: 'Romagnat',
  keyword: '10-km-paris-centre'
};

const mockItemData2 = {
  title: `L'arverne run  -  nocturne`,
  dep: '63',
  city: 'Romagnat',
  keyword: 'foulees-de-lucial'
};

const Search = () => (
  <Layout>
    {'Search pages'}
    <EventListItem data={mockItemData} />
    <EventListItem data={mockItemData2} lastItem />
  </Layout>
);

export default Search;
