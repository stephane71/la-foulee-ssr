import moment from 'moment';
import Router from 'next/router';
import { connect } from 'react-redux';

import Header from './Header';
import Overlay from './Overlay';
import SideMenu from './SideMenu';
import SearchMobile from './SearchMobile';

import getUserLocation from '../utils/getUserLocation';

import GlobalStyles from '../styles';
import { HEIGHT_APPBAR, USER_POSITION_KEY } from '../enums';
import { APP_BACKGROUND_COLOR, tonic } from '../colors';
import { Base } from '../styles-variables';
import { setUserPosition, localStorageSet, toggleSearch } from '../actions';

moment.locale('fr');

class Layout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menu: false
    };

    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleSelectUserPosition = this.handleSelectUserPosition.bind(this);
  }

  render() {
    return (
      <div className={'root prevent-scroll'}>
        <Header
          onClickMenu={this.handleToggleMenu}
          onClickHeaderLogo={() => Router.push('/?from=header', '/', {})}
          onClickSearch={this.handleToggleSearch}
          showSearchTrigger
        />

        {this.props.children}

        <Overlay
          show={this.state.menu || this.props.searching}
          onClick={this.handleCloseMenu}
        />
        <SideMenu show={this.state.menu} onClose={this.handleCloseMenu} />

        {this.props.searching && (
          <SearchMobile
            onSelectAround={this.handleSelectUserPosition}
            onSelectCity={this.handleSelectCity}
            onLeaveSearch={this.handleToggleSearch}
          />
        )}

        <style jsx>{`
          .root {
            background: ${APP_BACKGROUND_COLOR};
            padding-top: ${HEIGHT_APPBAR}px;
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
        `}</style>

        <style global jsx>
          {GlobalStyles}
        </style>
      </div>
    );
  }

  handleToggleMenu() {
    this.setState(({ menu }) => ({ menu: !menu }));
  }

  handleCloseMenu() {
    this.setState({ menu: false });
  }

  handleToggleSearch() {
    this.props.dispatch(toggleSearch());
  }

  handleSelectCity(city) {
    this.setState({ city });
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
    searching: state.searching
  };
}

export default connect(mapStateToProps)(Layout);
