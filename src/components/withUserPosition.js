import store from 'store';

import Geohash, { GEOHASH_PRECISION } from '../utils/geohash';
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
      return (
        <WrappedComponent
          {...this.props}
          getUserGeolocation={this.getUserGeolocation}
        />
      );
    }

    getUserPosition(storedPosition) {
      if (storedPosition) return;
      let position = store.get(USER_POSITION_KEY) || null;
      store.remove('position'); // Remove legacy key

      this.props.dispatch(setUserPosition(position));
    }

    getUserGeolocation() {
      return new Promise((resolve, reject) => {
        // TODO: fallback if error or timeout
        navigator.geolocation.getCurrentPosition(
          position => {
            const geohash = Geohash.encode(
              position.coords.latitude,
              position.coords.longitude,
              GEOHASH_PRECISION
            );
            resolve(geohash);
          },
          error => {
            console.error(error);
            reject(error);
          }
        );
      });
    }
  };
};

export default withUserPosition;
