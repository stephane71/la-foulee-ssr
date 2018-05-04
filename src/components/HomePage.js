import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import Button from './Button';

import Geohash, { GEOHASH_PRECISION } from '../utils/geohash';
import { setUserPosition, localStorageSet } from '../actions';
import { USER_POSITION_KEY } from '../enums';

export class HomePage extends React.PureComponent {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>{'Home page'}</h3>
        <Button onClick={this.getUserGeolocation.bind(this)}>
          {'Les évenements autour de moi'}
        </Button>
      </div>
    );
  }

  getUserGeolocation() {
    // TODO: fallback if error or timeout
    navigator.geolocation.getCurrentPosition(
      position => {
        const geohash = Geohash.encode(
          position.coords.latitude,
          position.coords.longitude,
          GEOHASH_PRECISION
        );
        this.props.dispatch(setUserPosition(geohash));
        this.props.dispatch(localStorageSet(USER_POSITION_KEY, geohash));
        Router.push({ pathname: '/', query: { from: 'home' } }, `/search`);
      },
      error => {
        console.error(error);
      }
    );
  }
}

export default connect()(withRouter(HomePage));
