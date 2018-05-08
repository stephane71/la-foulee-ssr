import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import withUserPosition from '../components/withUserPosition';
import HomePage from '../components/HomePage';

import EventListContainer from '../containers/EventListContainer';

class Index extends React.PureComponent {
  render() {
    return (
      <>
        {!this.props.position ? (
          <HomePage />
        ) : (
          <EventListContainer {...this.props} />
        )}
      </>
    );
  }
}

Index.getInitialProps = function({ store, isServer, ...context }) {
  return {};
};

function mapStateToProps(state) {
  return {
    position: state.position
  };
}

const IndexCompose = compose(withUserPosition)(Index);

export default connect(mapStateToProps)(IndexCompose);
