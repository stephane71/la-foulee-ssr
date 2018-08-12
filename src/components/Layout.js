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
import Loader from './Loader';

import getUserLocation from '../utils/getUserLocation';
import getGeohash from '../utils/geohash';
import { event } from '../utils/gtag';

import GlobalStyles from '../styles';
import { USER_POSITION_KEY, MAX_WIDTH } from '../enums';
import { toggleSearch, setSearchingGeohash } from '../actions';

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

    this.state = {
      city: null,
      cityMap: {},
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
    if (nextProps.query !== this.props.query) {
      const cityName = nextProps.query.city;
      const cityCache = this.state.cityMap[cityName];

      const city = cityCache ? cityCache : { name: cityName };
      this.setState({ city });
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
    const { city } = this.state;

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
            {this.state.error ? (
              <LayoutError error={this.state.error} />
            ) : (
              children
            )}
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

    let cityDetails;
    try {
      cityDetails = await this.getCityDetails(city);
    } catch (error) {
      this.setState({ error });
      return;
    }

    let geohash = getGeohash(cityDetails.location);

    this.setState({
      city: cityDetails,
      cityMap: { ...this.state.cityMap, [cityDetails.name]: cityDetails }
    });
    Router.push(`/events?position=${geohash}&city=${cityDetails.name}`);
    this.props.dispatch(setSearchingGeohash(false));

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

  async getCityDetails(_city = null) {
    if (!_city) {
      let location = await getUserLocation();
      _city = await this.props.reverseGeocoding(location);
    }

    return this.props.getDetails(_city.placeId);
  }
}

function mapStateToProps(state) {
  return {
    searching: state.searching
  };
}

const LayoutWithGoogleMaps = withGoogleMaps(Layout);

export default connect(mapStateToProps)(LayoutWithGoogleMaps);
