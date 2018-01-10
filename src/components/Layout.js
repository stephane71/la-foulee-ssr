import Header from './Header';
import { HEIGHT_APPBAR } from '../styles-variables';

import GlobalStyles from '../styles';

import moment from 'moment';
moment.locale('fr');

const Layout = props => (
  <div className={'root'}>
    <Header />
    {props.children}
    <style jsx>{`
      .root {
        min-height: 100vh;
        height: 1px;
        padding-top: ${HEIGHT_APPBAR}px;
      }
    `}</style>
    <style global jsx>
      {GlobalStyles}
    </style>
  </div>
);

export default Layout;
