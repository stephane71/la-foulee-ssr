import React from 'react';
import moment from 'moment';
import Router from 'next/router';
import css from 'styled-jsx/css';
import { connect } from 'react-redux';

import Header from './Header';
import Overlay from './Overlay';
import SearchMobile from './SearchMobile';
import GoogleMapPlacesApi from './GoogleMapPlacesApi';

import getUserLocation from '../utils/getUserLocation';
import Geohash, { GEOHASH_PRECISION } from '../utils/geohash';

import GlobalStyles from '../styles';
import {
  HEIGHT_APPBAR,
  USER_POSITION_KEY,
  MAX_WIDTH,
  GOOGLE_DETAILS_SERVICE
} from '../enums';
import { APP_BACKGROUND_COLOR, tonic } from '../colors';
import { Base } from '../styles-variables';
import { setUserPosition, localStorageSet, toggleSearch } from '../actions';

moment.locale('fr');

export const ScrollElementContext = React.createContext();

const style = css`
  .root {
    height: 100%;
  }

  .ScrollWrapper {
    height: 100%;
    overflow: auto;
    display: flex;
    justify-content: center;
    position: relative;
    -webkit-overflow-scrolling: touch;
  }

  .PagesWrapper {
    width: 100%;
    max-width: ${MAX_WIDTH}px;
  }
`;

class Layout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
      city: null
    };

    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleSelectUserPosition = this.handleSelectUserPosition.bind(this);
    this.handleSelectCity = this.handleSelectCity.bind(this);
  }

  componentDidMount() {
    Router.prefetch('/');
  }

  render() {
    return (
      <div className={'root'}>
        <Header
          onClickHeaderLogo={() => Router.push('/')}
          onClickSearch={this.handleToggleSearch}
          showSearchTrigger={this.props.currentRoute !== '/'}
          showBackArrow={this.props.query.keyword}
        />

        <div
          ref={e => this.setState({ scrollingElement: e })}
          className={'ScrollWrapper'}
        >
          <ScrollElementContext.Provider value={this.state.scrollingElement}>
            <div className={'PagesWrapper'}>{this.props.children}</div>
          </ScrollElementContext.Provider>
        </div>

        <Overlay
          show={this.state.menu || this.props.searching}
          onClick={this.handleClickOverlay}
          headerPadding={this.props.searching}
        />

        {this.props.searching && (
          <SearchMobile
            onSelectAround={this.handleSelectUserPosition}
            onSelectCity={this.handleSelectCity}
            onLeave={this.handleToggleSearch}
          />
        )}

        <style jsx>{style}</style>

        <style global jsx>
          {GlobalStyles}
        </style>
      </div>
    );
  }

  handleClickOverlay() {
    this.handleCloseMenu();
    this.handleToggleSearch(false);
  }

  handleCloseMenu() {
    this.setState({ menu: false });
  }

  handleToggleSearch(toggle) {
    this.props.dispatch(toggleSearch(toggle));
  }

  async handleSelectCity(_city) {
    const city = _city.geometry
      ? _city
      : await GoogleMapPlacesApi.getDetails(
          this.props.googleMapsServiceDetails,
          _city.placeId
        );

    this.setState({ city });
    this.handleToggleSearch();

    const geohash = Geohash.encode(
      city.geometry.location.lat(),
      city.geometry.location.lng(),
      GEOHASH_PRECISION
    );

    Router.push(`/events?position=${geohash}`);
  }

  async handleSelectUserPosition() {
    this.handleToggleSearch();
    const geohash = await getUserLocation();
    this.props.dispatch(setUserPosition(geohash));
    this.props.dispatch(localStorageSet(USER_POSITION_KEY, geohash));
  }
}

function mapStateToProps(state) {
  return {
    searching: state.searching,
    position: state.position,
    googleMapsServiceDetails: state.googleMapsService[GOOGLE_DETAILS_SERVICE]
  };
}

export default connect(mapStateToProps)(Layout);
