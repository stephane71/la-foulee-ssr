import { connect } from 'react-redux';
import Link from 'next/link';

import { setEventListReadyFlag } from '../actions';

const HomePage = props => {
  props.dispatch(setEventListReadyFlag());
  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{'Home page'}</h3>
      <Link href={'/?from=home'} as={'/search'}>
        <a>{'Go search an event !'}</a>
      </Link>
    </div>
  );
};

export default connect()(HomePage);
