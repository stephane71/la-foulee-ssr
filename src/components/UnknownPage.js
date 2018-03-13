import { connect } from 'react-redux';

import { setEventListReadyFlag } from '../actions';

const UnknownPage = props => {
  props.dispatch(setEventListReadyFlag());
  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{'Unknown page'}</h3>
    </div>
  );
};

export default connect()(UnknownPage);
