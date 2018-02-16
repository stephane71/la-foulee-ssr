import moment from 'moment';

import Header from './Header';

import GlobalStyles from '../styles';
import { HEIGHT_APPBAR } from '../styles-variables';

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
