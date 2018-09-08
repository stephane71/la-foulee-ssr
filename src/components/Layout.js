import React from 'react';
import moment from 'moment';
import Router from 'next/router';
import css from 'styled-jsx/css';
import slug from 'slug';
import { connect } from 'react-redux';

import Header from './Header';
import Overlay from './Overlay';
import SearchMobile from './SearchMobile';
import withGoogleMaps from './withGoogleMaps';
import LayoutError from './LayoutError';
import Loader from './Loader';

import getUserLocation from '../utils/getUserLocation';
import getGeohash from '../utils/geohash';
import { event } from '../utils/gtag';

import GlobalStyles from '../styles';
import { MAX_WIDTH } from '../enums';
import { toggleSearch, setSearchingGeohash, addCity } from '../actions';

moment.locale('fr');

export const SelectedCityContext = React.createContext();

const style = css`
  .root {
    height: 100%;
  }

  .PagesWrapper {
    height: 100%;
    width: 100%;
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .LoaderWrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: ${MAX_WIDTH}px;
    z-index: 10;
    background-color: transparent;
  }
`;

class Layout extends React.PureComponent {
  constructor(props) {
    super(props);

    const { query, cityMap } = props;

    this.state = {
      city: query.city ? cityMap[query.city] : {},
      error: null
    };

    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleSelectLocation = this.handleSelectLocation.bind(this);
  }

  componentDidMount() {
    Router.prefetch('/');

    Router.beforePopState(({ url, as, options }) => {
      if (this.props.searching) {
        this.handleToggleSearch();
        // This solution works when the user goes back in history
        // Unfortunately we can not know if he goes back or forward
        // history.go(1);
        // return false;
      }
      return true;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.query.city &&
      nextProps.query.city !== this.props.query.city
    ) {
      this.getCityDetails(nextProps.query.city).then(city =>
        this.setState({ city })
      );
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
    const { city, error } = this.state;

    return (
      <div className={'root'}>
        <Header
          onClickHeaderLogo={this.handleHomeRedirect}
          onClickSearch={this.handleClickSearch}
          showBackArrow={query.keyword}
          isHomeRoute={currentRoute === '/'}
        />

        <SelectedCityContext.Provider value={city}>
          <div className={'PagesWrapper'}>
            {error ? <LayoutError error={error} /> : children}
          </div>
        </SelectedCityContext.Provider>

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
    this.props.dispatch(setSearchingGeohash(true));
    this.setState({ error: null });
    this.handleToggleSearch();

    const cityDetails = await this.getCityDetails(city && city.placeId);
    const geohash = getGeohash(cityDetails.location);

    this.props.dispatch(setSearchingGeohash(false));

    Router.push(
      {
        pathname: '/events',
        query: { position: geohash, city: cityDetails.place_id }
      },
      `/events/${slug(cityDetails.name, { lower: true })}`
    );

    /*
     * Google Analytics
     */
    let label;
    if (city) {
      label = city.placeId ? 'Preselected city' : 'Searched city';
    } else {
      label = 'User position';
    }

    event({
      action: 'Select City',
      category: 'Search',
      label,
      value: cityDetails.name
    });
  }

  async getCityDetails(placeId) {
    let cityDetails;

    cityDetails = this.props.cityMap[placeId];
    if (!cityDetails) {
      try {
        if (!placeId) {
          const location = await getUserLocation();
          const city = await this.props.reverseGeocoding(location);
          placeId = city.place_id;
        }
        cityDetails = await this.props.getDetails(placeId);
      } catch (error) {
        console.log(error);
        this.setState({ error });
        return;
      }
      this.props.dispatch(addCity(cityDetails));
    }

    return cityDetails;
  }
}

function mapStateToProps(state) {
  return {
    searching: state.searching,
    cityMap: state.cityMap
  };
}

const LayoutWithGoogleMaps = withGoogleMaps(Layout);

export default connect(mapStateToProps)(LayoutWithGoogleMaps);
