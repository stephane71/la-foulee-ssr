import store from 'store';

import { setUserPosition } from '../actions';
import { USER_POSITION_KEY } from '../enums';

const withUserPosition = WrappedComponent => {
  return class Wrapper extends React.Component {
    static displayName = `withUserPosition(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    constructor(props) {
      super(props);

      this.getUserPosition(props.position);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

    getUserPosition(storedPosition) {
      if (storedPosition) return;
      let position = store.get(USER_POSITION_KEY) || null;
      store.remove('position'); // Remove legacy key

      this.props.dispatch(setUserPosition(position));
    }
  };
};

export default withUserPosition;
