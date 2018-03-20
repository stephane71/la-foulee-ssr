import moment from 'moment';
import Router from 'next/router';

import Header from './Header';
import Overlay from './Overlay';
import SideMenu from './SideMenu';

import GlobalStyles from '../styles';
import { HEIGHT_APPBAR } from '../styles-variables';

moment.locale('fr');

class Layout extends React.PureComponent {
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

        <Overlay show={this.state.menu} onClick={this.handleCloseMenu} />
        <SideMenu show={this.state.menu} onClose={this.handleCloseMenu} />

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

export default Layout;
