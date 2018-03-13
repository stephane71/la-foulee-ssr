import { connect } from 'react-redux';

import { setEventListReadyFlag } from '../actions';

const HomePage = props => {
  props.dispatch(setEventListReadyFlag());
  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{'Home page'}</h3>
    </div>
  );
};

export default connect()(HomePage);
