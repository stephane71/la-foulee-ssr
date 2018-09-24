import React from 'react';
import Link from 'next/link';

import LogoTonic from '../svgs/lafoulee-tonic.svg';
import CrossIcon from '../svgs/ic_close_black_24px.svg';
import SearchIcon from '../svgs/ic_search_black_24px.svg';
import InfoIcon from '../svgs/ic_info_outline_black_24px.svg';
import MailIcon from '../svgs/ic_mail_outline_black_24px.svg';

import {
  getSpacing,
  getFontSize,
  Base,
  BaseLineHeight,
  BaseRadius
} from '../styles-variables';
import { white, dominant } from '../colors';
import { HEIGHT_APPBAR } from '../enums';

// Duplicate
const HEIGHT_LOGO_APP_HEADER = HEIGHT_APPBAR - Base * 9;
const WIDTH_LOGO_APP_HEADER = Base * 27;

const LINK_MENU = [
  {
    href: '/',
    text: 'Chercher un event',
    Icon: SearchIcon
  },
  {
    href: '/about',
    text: 'À propos',
    Icon: InfoIcon
  },
  {
    href: '/contact',
    text: 'Contactez nous',
    Icon: MailIcon
  }
];

const SideMenu = ({ show, onClose }) => (
  <div className={`SideMenu ${show ? '' : 'SideMenu--hide'}`}>
    <header className={'SideMenu-header'}>
      <LogoTonic
        height={`${HEIGHT_LOGO_APP_HEADER}px`}
        width={`${WIDTH_LOGO_APP_HEADER}`}
      />
      <div className={'Button--flat Button--square'} onClick={onClose}>
        <CrossIcon fill={`#F4F5F7`} style={{ verticalAlign: 'top' }} />
      </div>
    </header>

    <nav className={'SideMenu-Nav'} onClick={() => onClose()}>
      <ul className={'List'}>
        {LINK_MENU.map(({ href, text, Icon }, i) => (
          <Link key={i} href={href} prefetch>
            <li className={'SideMenuNav-Item List-Item Item'}>
              <span className={'SideMenuNavItem-Icon Item-Icon'}>
                <Icon fill={`#7A9691`} style={{ verticalAlign: 'top' }} />
              </span>

              <span className={'SideMenuNavItem-Label Item-Label'}>{text}</span>
            </li>
          </Link>
        ))}
      </ul>
    </nav>

    <footer className={'SideMenu-Footer'} onClick={() => onClose()}>
      <Link href={`/legal`} prefetch>
        <div className={'SideMenuFooter-container'}>
          <div>{'La Foulée ©2018'}</div>
          <span className={'SideMenuFooter-Link'}>{'Mentions légales'}</span>
          <span className={'SideMenuFooter-Link'}>{'Confidentialité'}</span>
          <span
            className={'SideMenuFooter-Link'}
          >{`Conditions d'utilisation`}</span>
        </div>
      </Link>
    </footer>

    <style jsx>{`
      .SideMenu {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        z-index: 10;
        transition: transform 0.25s ease-out, box-shadow 1s ease-in;
        width: ${Base * 80}px;
        background-color: ${dominant};
        color: ${white};
        display: flex;
        flex-direction: column;
        transform-origin: left center;
        transform: translate(0%);
        box-shadow: 10px 0 20px 0 rgba(48, 43, 43, 0.2);
        border-radius: 0 ${BaseRadius}px ${BaseRadius}px 0;
      }

      .SideMenu--hide {
        transition: transform 0.25s ease-in, box-shadow 0.25s ease-out;
        transform: translate(-100%);
        box-shadow: none;
      }

      .SideMenu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #5a6362;
        padding: ${getSpacing('xxs')}px 0 ${getSpacing('xxs') - 1}px
          ${getSpacing('m')}px;
      }

      .SideMenu-Nav {
        margin-top: ${getSpacing('l')}px;
      }

      .SideMenuNav-Item {
        color: #cfe6e1;
      }

      .SideMenuNavItem-Icon {
        width: ${Base * 6}px;
        padding: 0;
        margin-left: ${getSpacing('s')}px;
        display: inline-block;
        vertical-align: top;
        text-align: center;
      }

      .SideMenuNavItem-Label {
        margin-left: ${getSpacing('m')}px;
        line-height: ${BaseLineHeight}px;
      }

      .SideMenu-Footer {
        margin-top: auto;
        font-size: ${getFontSize('s')}px;
        color: #69968d;
      }

      .SideMenuFooter-container {
        padding: ${getSpacing('m')}px;
      }

      .SideMenuFooter-Link {
        display: inline-block;
        text-decoration: underline;
      }
    `}</style>
  </div>
);

export default SideMenu;
