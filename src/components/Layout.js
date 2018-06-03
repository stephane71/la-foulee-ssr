import React from 'react';
import moment from 'moment';
import Router from 'next/router';
import { connect } from 'react-redux';

import Header from './Header';
import Overlay from './Overlay';
// import SideMenu from './SideMenu';
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

export const ScrollElementContext = React.createContext('test');

class Layout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menu: false,
      city: null
    };

    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleSelectUserPosition = this.handleSelectUserPosition.bind(this);
    this.handleSelectCity = this.handleSelectCity.bind(this);
  }

  render() {
    return (
      <div className={'root'}>
        <Header
          // onClickMenu={this.handleToggleMenu}
          onClickHeaderLogo={() => Router.push('/?from=header', '/', {})}
          onClickSearch={this.handleToggleSearch}
          showSearchTrigger={this.props.position}
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
        {/* <SideMenu show={this.state.menu} onClose={this.handleCloseMenu} /> */}

        {this.props.searching && (
          <SearchMobile
            onSelectAround={this.handleSelectUserPosition}
            onSelectCity={this.handleSelectCity}
            onLeave={this.handleToggleSearch}
          />
        )}

        <style jsx>{`
          .root {
            background: ${APP_BACKGROUND_COLOR};
            padding-top: ${HEIGHT_APPBAR}px;
            overflow: auto;
            height: 100vh;
          }

          .root:before {
            background: ${tonic};
            position: absolute;
            content: '';
            bottom: 0;
            left: 0;
            right: 0;
            clip-path: polygon(0 68%, 100% 0%, 100% 100%, 0% 100%);
            height: calc(${Base}px * 80);
            margin: 0 auto;
          }

          .PagesWrapper {
            width: 100%;
            max-width: ${MAX_WIDTH}px;
          }

          .ScrollWrapper {
            height: 100%;
            overflow: auto;
            display: flex;
            justify-content: center;
            position: relative;
          }
        `}</style>

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

  handleToggleMenu() {
    this.setState(({ menu }) => ({ menu: !menu }));
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

    this.props.dispatch(setUserPosition(geohash));
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
