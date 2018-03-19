import moment from 'moment';
import Router from 'next/router';
import Link from 'next/link';

import Header from './Header';
import LogoTonic from '../svgs/lafoulee-tonic.svg';
import CrossIcon from '../svgs/ic_close_black_24px.svg';

import GlobalStyles from '../styles';
import { HEIGHT_APPBAR, getSpacing } from '../styles-variables';
import { white, dominant } from '../colors';

moment.locale('fr');

export default class Layout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menu: false
    };

    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
  }

  render() {
    return (
      <div className={'root prevent-scroll'}>
        <Header
          onClickMenu={this.handleToggleMenu}
          onClickHeaderLogo={() => Router.push('/?from=header', '/', {})}
        />

        {this.props.children}

        <SideMenu show={this.state.menu} onClose={this.handleCloseMenu} />
        {/* <OverLay  show={this.state.menu} /> */}

        <style jsx>{`
          .root {
            padding-top: ${HEIGHT_APPBAR}px;
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
}

// Duplicate
const HEIGHT_LOGO_APP_HEADER = HEIGHT_APPBAR - 8;

const SideMenu = ({ show, onClose }) => (
  <div className={`SideMenu ${show ? '' : 'SideMenu--hide'}`}>
    <header className={'SideMenu-header'}>
      <LogoTonic height={`${HEIGHT_APPBAR - 8}px`} />
      <div className={'SideMenu-close'} onClick={onClose}>
        <CrossIcon fill={white} style={{ verticalAlign: 'middle' }} />
      </div>
    </header>
    <nav className={'SideMenu-list'}>
      <ul>
        <li onClick={onClose}>
          <Link href={'/?to=search'} as={'/search'}>
            <a>{'Chercher un event'}</a>
          </Link>
        </li>
        <li onClick={onClose}>
          <Link href={'/?to=about'} as={'/about'}>
            <a>{'À propos'}</a>
          </Link>
        </li>
        <li onClick={onClose}>
          <Link href={'/?to=contact'} as={'/contact'}>
            <a>{'Contactez nous'}</a>
          </Link>
        </li>
      </ul>
    </nav>
    <div className={'SideMenu-companyInfo'} />

    <style jsx>{`
      .SideMenu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        transition: left 0.3s ease-out;
        width: 90%;
        max-width: 320px;
        background-color: ${dominant};
        color: ${white};
      }

      .SideMenu--hide {
        left: -100%;
      }

      .SideMenu-header {
        padding: ${getSpacing('s')}px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid ${white};
      }

      .SideMenu-list {
      }

      .SideMenu-companyInfo {
      }

      .SideMenu-close {
        padding: ${getSpacing('s')}px;
      }
    `}</style>
  </div>
);
