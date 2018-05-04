/*
  This Component is supposed to work only on client side

  const ClientSideUserPosition = dynamic(
    import('../components/ClientSideUserPosition'),
    {
      ssr: false,
      loading: () => null
    }
  );

*/

import store from 'store';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { setUserPosition } from '../actions';

const ClientSideUserPosition = ({ currentPosition, router, dispatch }) => {
  if (!currentPosition) {
    let position = store.get('position');

    if (!position && router.asPath === '/search') {
      Router.replace('/', '/');
    } else if (position) {
      dispatch(setUserPosition(position));
    }
  }
  return null;
};

export default connect()(withRouter(ClientSideUserPosition));
