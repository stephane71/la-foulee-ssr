import React from 'react';
import moment from 'moment';
import Router from 'next/router';
import css from 'styled-jsx/css';
import { connect } from 'react-redux';

import Header from './Header';
import Overlay from './Overlay';
import SearchMobile from './SearchMobile';
import withGoogleMaps from './withGoogleMaps';
import LayoutError from './LayoutError';

import getUserLocation from '../utils/getUserLocation';
import getGeohash from '../utils/geohash';
import { event } from '../utils/gtag';

import GlobalStyles from '../styles';
import { USER_POSITION_KEY, MAX_WIDTH } from '../enums';
import { toggleSearch } from '../actions';

moment.locale('fr');

export const ScrollElementContext = React.createContext();
export const SelectedCityContext = React.createContext();

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
      city: null,
      error: null
    };

    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleSelectLocation = this.handleSelectLocation.bind(this);
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
    if (
      nextProps.currentRoute !== this.props.currentRoute ||
      nextProps.currentRoute === '/'
    ) {
      this.setState({ error: null });
    }
  }

  render() {
    const { currentRoute, query, children, searching } = this.props;
    const { scrollingElement, city } = this.state;

    return (
      <div className={'root'}>
        <Header
          onClickHeaderLogo={this.handleHomeRedirect}
          onClickSearch={this.handleClickSearch}
          showSearchTrigger={currentRoute !== '/'}
          showBackArrow={query.keyword}
        />

        <div
          ref={e => this.setState({ scrollingElement: e })}
          className={'ScrollWrapper'}
        >
          <ScrollElementContext.Provider value={scrollingElement}>
            <SelectedCityContext.Provider value={city}>
              <div className={'PagesWrapper'}>
                {this.state.error ? (
                  <LayoutError error={this.state.error} />
                ) : (
                  children
                )}
              </div>
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
            onSelectLocation={this.handleSelectLocation}
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

  handleHomeRedirect() {
    event({
      action: 'Redirect',
      category: 'Home',
      label: 'Redirect Home from logo or house icon'
    });

    Router.push('/');
  }

  handleClickSearch() {
    event({
      action: 'Trigger Search',
      category: 'Search',
      label: 'From header icon'
    });

    this.handleToggleSearch();
  }

  handleClickOverlay() {
    this.handleToggleSearch();
  }

  handleToggleSearch(toggle) {
    this.props.dispatch(toggleSearch(toggle));
  }

  async handleSelectLocation(city = null) {
    this.setState({ error: null });
    this.handleToggleSearch();

    let location;
    try {
      location = city
        ? await this.getLocationFromCity(city)
        : await this.getLocationFromUser();
    } catch (error) {
      this.setState({ error });
      return;
    }

    this.setState({ city: location.city });
    Router.push(
      `/events?position=${location.geohash}&city=${location.city.name}`
    );
  }

  async getLocationFromCity(_city = {}) {
    let city = _city.location
      ? _city
      : await this.props.getDetails(_city.placeId);
    let geohash = getGeohash(city.location);

    return { city, geohash };
  }

  async getLocationFromUser() {
    let location = await getUserLocation();

    let cityName = await this.props.reverseGeocoding(location);
    let geohash = getGeohash(location);

    return { city: { name: cityName }, geohash };
  }
}

function mapStateToProps(state) {
  return {
    searching: state.searching
  };
}

const LayoutWithGoogleMaps = withGoogleMaps(Layout);

export default connect(mapStateToProps)(LayoutWithGoogleMaps);
