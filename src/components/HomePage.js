import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';

import { setUserPosition, localStorageSet } from '../actions';

import Button from './Button';

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
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.props.dispatch(setUserPosition(coords));
        this.props.dispatch(localStorageSet('position', coords));
        Router.push({ pathname: '/', query: { from: 'home' } }, `/search`);
      },
      error => {
        console.error(error);
      }
    );
  }
}

export default connect()(withRouter(HomePage));
