import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import EventListContainer from '../containers/EventListContainer';

import withUserPosition from '../components/withUserPosition';
import HomePage from '../components/HomePage';
import SearchMobile from '../components/SearchMobile';

import { setUserPosition, localStorageSet } from '../actions';
import { USER_POSITION_KEY } from '../enums';

class Index extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searching: false,
      city: ''
    };

    this.handleCitySelect = this.handleCitySelect.bind(this);
    this.handleSearchCityToggle = this.handleSearchCityToggle.bind(this);
    this.handleUserPositionSelect = this.handleUserPositionSelect.bind(this);
  }

  render() {
    return (
      <>
        {this.props.position ? (
          <EventListContainer {...this.props} />
        ) : this.state.searching ? (
          <SearchMobile
            onSelectAround={this.handleUserPositionSelect}
            onResetInput={this.handleInputReset}
            onGoBack={this.handleSearchCityToggle}
            onSelectCity={this.handleCitySelect}
          />
        ) : (
          <HomePage onClick={this.handleSearchCityToggle} />
        )}
      </>
    );
  }

  handleSearchCityToggle(searching) {
    this.setState(({ searching }) => ({ searching: !searching }));
  }

  handleCitySelect(city) {
    this.setState({ city });
  }

  async handleUserPositionSelect() {
    const geohash = await this.props.getUserGeolocation();
    this.props.dispatch(setUserPosition(geohash));
    this.props.dispatch(localStorageSet(USER_POSITION_KEY, geohash));
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
