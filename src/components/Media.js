import React from 'react';
import { connect } from 'react-redux';

import { MAX_WIDTH, DESKTOP, MOBILE } from '../enums';
import { setMediaType } from '../actions';

class Media extends React.Component {
  componentWillMount() {
    if (typeof window !== 'object') return;

    this.mediaQuery = window.matchMedia(`(max-width: ${MAX_WIDTH}px)`);
    this.mediaQuery.addListener(this.updateMatches);
    this.updateMatches();
  }

  componentWillUnmount() {
    this.mediaQuery.removeListener(this.updateMatches);
  }

  render() {
    const { children } = this.props;

    return children;
  }

  updateMatches = () =>
    this.props.dispatch(
      setMediaType(this.mediaQuery.matches ? MOBILE : DESKTOP)
    );
}

export default connect()(Media);
