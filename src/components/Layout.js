import React from "react";
import moment from "moment";
import dynamic from "next/dynamic";
import css from "styled-jsx/css";
import slug from "slug";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";

import Header from "./Header";
import Overlay from "./Overlay";
import Search from "./Search";
import LayoutError from "./LayoutError";
import Loader from "./Loader";
import AppFooter from "./AppFooter";

import withReverseGeocoding from "./withReverseGeocoding";

const GoogleMapInitServices = dynamic(import("./GoogleMapInitServices"), {
  ssr: false,
  loading: () => null
});

import getGeohash from "../utils/geohash";
import getUserLocation from "../utils/getUserLocation";
import { event } from "../utils/gtag";

import GlobalStyles from "../styles";
import { MAX_WIDTH, HEIGHT_APPBAR } from "../enums";
import { toggleSearch } from "../actions";

moment.locale("fr");

const style = css`
  .LayoutSection {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  .LayoutNav {
    height: ${HEIGHT_APPBAR}px;
  }

  .LayoutMain {
    display: flex;
    flex: 1 0 auto;
  }

  .LayoutFooter {
  }

  .PagesWrapper {
    width: 100%;
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;
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
      error: null
    };

    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleSelectPlace = this.handleSelectPlace.bind(this);
  }

  componentDidMount() {
    Router.prefetch("/");

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
    const { router } = this.props;
    const { router: nextRouter } = nextProps;

    if (nextRouter.asPath !== router.asPath || nextRouter.asPath === "/") {
      this.setState({ error: null });
    }
  }

  render() {
    const { router, children, searching } = this.props;
    const { place, error } = this.state;
    const { query, asPath } = router;

    return (
      <>
        <GoogleMapInitServices />

        <section className={"LayoutSection"}>
          <nav className={"LayoutNav"} role={"navigation"}>
            <Header
              onClickHeaderLogo={this.handleHomeRedirect}
              onClickSearch={this.handleClickSearch}
              showBackArrow={query && query.keyword}
              isHomeRoute={asPath === "/"}
            />
          </nav>

          <main className={"LayoutMain"} role={"main"}>
            <div className={"PagesWrapper"}>
              {error ? <LayoutError error={error} /> : children}
            </div>
          </main>

          <footer className={"LayoutFooter"} role={"contentinfo"}>
            <AppFooter />
          </footer>

          <style jsx>{style}</style>

          <style global jsx>
            {GlobalStyles}
          </style>
        </section>

        <Overlay
          show={searching}
          onClick={this.handleClickOverlay}
          headerPadding={searching}
        />

        {searching && (
          <Search
            onSelectPlace={this.handleSelectPlace}
            onLeave={this.handleToggleSearch}
          />
        )}
      </>
    );
  }

  handleHomeRedirect() {
    event({
      action: "Redirect",
      category: "Home",
      label: "Redirect Home from logo or house icon"
    });

    Router.push("/");
  }

  handleClickSearch() {
    event({
      action: "Trigger Search",
      category: "Search",
      label: "From header icon"
    });

    this.handleToggleSearch();
  }

  handleClickOverlay() {
    this.handleToggleSearch();
  }

  handleToggleSearch(toggle) {
    this.props.dispatch(toggleSearch(toggle));
  }

  async handleSelectPlace(place = null) {
    this.setState({ error: null });
    this.handleToggleSearch();

    if (!place) {
      const location = await getUserLocation();
      place = await this.props.reverseGeocoding(location);
    }

    const department = slug(place.county, { lower: true });
    const city = slug(place.name, { lower: true });
    const position = getGeohash(place.location);

    Router.push(
      {
        pathname: "/events",
        query: { placeSlug: `${department}_${city}`, position }
      },
      `/events/${department}/${city}`
    );
  }
}

function mapStateToProps(state) {
  return {
    searching: state.searching
  };
}

const WithRouter = withRouter(Layout);
const WithReverseGeocoding = withReverseGeocoding(WithRouter);

export default connect(mapStateToProps)(WithReverseGeocoding);
