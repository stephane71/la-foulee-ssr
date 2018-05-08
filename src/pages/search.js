import Link from 'next/link';

const Search = () => (
  <div>
    {'Search Page'}

    <Link href={'/about'}>
      <a>{'About Page'}</a>
    </Link>
  </div>
);

export default Search;
