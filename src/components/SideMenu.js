import Router from 'next/router';

import LogoTonic from '../svgs/lafoulee-tonic.svg';
import CrossIcon from '../svgs/ic_close_black_24px.svg';
import SearchIcon from '../svgs/ic_search_black_24px.svg';
import InfoIcon from '../svgs/ic_info_outline_black_24px.svg';
import MailIcon from '../svgs/ic_mail_outline_black_24px.svg';

import { getSpacing } from '../styles-variables';
import { white, dominant } from '../colors';
import { HEIGHT_APPBAR } from '../enums';

// Duplicate
const HEIGHT_LOGO_APP_HEADER = HEIGHT_APPBAR - 8;

const LINK_MENU = [
  {
    name: 'search',
    text: 'Chercher un event',
    Icon: SearchIcon
  },
  {
    name: 'about',
    text: 'À propos',
    Icon: InfoIcon
  },
  {
    name: 'contact',
    text: 'Contactez nous',
    Icon: MailIcon
  }
];

const handleMenuSelect = route => {
  Router.push({ pathname: '/', query: { to: route } }, `/${route}`);
};

const SideMenu = ({ show, onClose }) => (
  <div className={`SideMenu ${show ? '' : 'SideMenu--hide'}`}>
    <header className={'SideMenu-header SideMenu--padding'}>
      <LogoTonic height={`${HEIGHT_APPBAR - 8}px`} />
      <div className={'SideMenu--padding'} onClick={onClose}>
        <CrossIcon fill={white} style={{ verticalAlign: 'middle' }} />
      </div>
    </header>
    <nav className={'SideMenu-list'}>
      <ul>
        {LINK_MENU.map(({ name, text, Icon }, i) => (
          <li
            key={i}
            className={'SideMenu--padding'}
            onClick={() => {
              handleMenuSelect(name);
              onClose();
            }}
          >
            <span className={'SideMenu--padding'}>
              <Icon fill={white} style={{ verticalAlign: 'middle' }} />
            </span>

            <span>{text}</span>
          </li>
        ))}
      </ul>
    </nav>
    <div
      className={'SideMenu-companyInfo SideMenu--padding'}
      onClick={() => {
        handleMenuSelect('legal');
        onClose();
      }}
    >
      <span>
        {`Mentions légales - Confidentialité - Conditions d'utilisation`}
      </span>
      <span>{'La Foulée @2018'}</span>
    </div>

    <style jsx>{`
      .SideMenu {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        z-index: 10;
        transition: left 0.3s ease-out;
        width: 90%;
        max-width: 320px;
        background-color: ${dominant};
        color: ${white};
        display: flex;
        flex-direction: column;
      }

      .SideMenu--hide {
        left: -100%;
      }

      .SideMenu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid ${white};
      }

      .SideMenu-list > ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .SideMenu-list > ul > li {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .SideMenu-companyInfo {
        margin-top: auto;
        display: flex;
        flex-direction: column;
      }

      .SideMenu--padding {
        padding: ${getSpacing('s')}px;
      }
    `}</style>
  </div>
);

export default SideMenu;
