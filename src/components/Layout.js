import React from 'react';
import moment from 'moment';
import Router from 'next/router';
import css from 'styled-jsx/css';
import { connect } from 'react-redux';

import Header from './Header';
import Overlay from './Overlay';
import SearchMobile from './SearchMobile';
import withGoogleMaps from './withGoogleMaps';

import getUserLocation from '../utils/getUserLocation';
import Geohash, { GEOHASH_PRECISION } from '../utils/geohash';

import GlobalStyles from '../styles';
import { USER_POSITION_KEY, MAX_WIDTH } from '../enums';
import { setUserPosition, toggleSearch } from '../actions';

moment.locale('fr');

export const ScrollElementContext = React.createContext();
export const SelectedCityContext = React.createContext();

function getGeohash({ lat, lng }) {
  return Geohash.encode(lat, lng, GEOHASH_PRECISION);
}

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
      // scrollingElement: null,
      city: null
    };

    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleSelectUserPosition = this.handleSelectUserPosition.bind(this);
    this.handleSelectCity = this.handleSelectCity.bind(this);
  }

  componentDidMount() {
    Router.prefetch('/');

    const { city } = this.props.query;
    if (city) this.setState({ city: { name: city } });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({ city: { name: nextProps.query.city } });
    }
  }

  render() {
    const { currentRoute, query, children, searching } = this.props;
    const { scrollingElement, city } = this.state;

    return (
      <div className={'root'}>
        <Header
          onClickHeaderLogo={() => Router.push('/')}
          onClickSearch={this.handleToggleSearch}
          showSearchTrigger={currentRoute !== '/'}
          showBackArrow={query.keyword}
        />

        <div
          ref={e => this.setState({ scrollingElement: e })}
          className={'ScrollWrapper'}
        >
          <ScrollElementContext.Provider value={scrollingElement}>
            <SelectedCityContext.Provider value={city}>
              <div className={'PagesWrapper'}>{children}</div>
            </SelectedCityContext.Provider>
          </ScrollElementContext.Provider>
        </div>

        <Overlay
          show={searching}
          onClick={this.handleClickOverlay}
          headerPadding={searching}
        />

        {searching && (
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
    this.handleToggleSearch();
  }

  handleToggleSearch(toggle) {
    this.props.dispatch(toggleSearch(toggle));
  }

  async handleSelectCity(_city = {}) {
    this.handleToggleSearch();

    const city = _city.location
      ? _city
      : await this.props.getDetails(_city.placeId);
    const geohash = getGeohash(city.location);

    this.setState({ city });
    Router.push(`/events?position=${geohash}&city=${city.name}`);
  }

  async handleSelectUserPosition() {
    this.handleToggleSearch();

    const location = await getUserLocation();
    const cityName = await this.props.reverseGeocoding(location);
    const geohash = getGeohash(location);

    this.props.dispatch(setUserPosition(geohash));
    this.setState({ city: { name: cityName } });
    Router.push(`/events?position=${geohash}&city=${cityName}`);
  }
}

function mapStateToProps(state) {
  return {
    searching: state.searching
  };
}

const LayoutWithGoogleMaps = withGoogleMaps(Layout);

export default connect(mapStateToProps)(LayoutWithGoogleMaps);
