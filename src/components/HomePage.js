import Link from 'next/link';

const HomePage = () => (
  <div style={{ textAlign: 'center' }}>
    <h3>{'Home page'}</h3>
    <Link href={'/?from=home'} as={'/search'}>
      <a>{'Go search an event !'}</a>
    </Link>
  </div>
);

export default HomePage;
