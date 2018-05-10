import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import EventListContainer from '../containers/EventListContainer';

import HomePage from '../components/HomePage';
import withUserPosition from '../components/withUserPosition';

import { toggleSearch } from '../actions';
import { MAX_WIDTH } from '../enums';

class Index extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      city: ''
    };

    this.handleSearchCityToggle = this.handleSearchCityToggle.bind(this);
  }

  render() {
    return (
      <div className={'IndexPage prevent-scroll'}>
        {this.props.position ? (
          <EventListContainer {...this.props} />
        ) : (
          <HomePage onClick={this.handleSearchCityToggle} />
        )}

        <style jsx>{`
          .IndexPage {
            max-width: ${MAX_WIDTH}px;
            margin: 0 auto;
          }
        `}</style>
      </div>
    );
  }

  handleSearchCityToggle() {
    this.props.dispatch(toggleSearch());
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
