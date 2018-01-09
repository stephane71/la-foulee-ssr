import Link from 'next/link';
import Layout from '../components/Layout';

const Index = () => (
  <Layout>
    <Link href={'/search'}>
      <a>{'Search Page'}</a>
    </Link>
    <p>{'Hello Next.js'}</p>
  </Layout>
);

export default Index;
