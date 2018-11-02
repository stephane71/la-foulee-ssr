import React from "react";
import moment from "moment";
import dynamic from "next/dynamic";
import css from "styled-jsx/css";
import slug from "slug";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";

import Header from "./Header";
import Overlay from "./Overlay";
import SearchMobile from "./SearchMobile";
import withGoogleMaps from "./withGoogleMaps";
import LayoutError from "./LayoutError";
import Loader from "./Loader";
import AppFooter from "./AppFooter";

const GoogleMapInitServices = dynamic(import("./GoogleMapInitServices"), {
  ssr: false,
  loading: () => null
});

import getUserLocation from "../utils/getUserLocation";
import getGeohash from "../utils/geohash";
import { event } from "../utils/gtag";

import GlobalStyles from "../styles";
import { MAX_WIDTH, HEIGHT_APPBAR } from "../enums";
import { toggleSearch, setSearchingGeohash, addPlace } from "../actions";

moment.locale("fr");

export const SelectedPlaceContext = React.createContext();

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

    const { router, placeMap } = props;
    const { query } = router;

    this.state = {
      place: query && query.place ? placeMap[query.place] : {},
      error: null
    };

    this.handleClickSearch = this.handleClickSearch.bind(this);
    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleToggleSearch = this.handleToggleSearch.bind(this);
    this.handleSelectLocation = this.handleSelectLocation.bind(this);
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

    if (
      (nextRouter.query && nextRouter.query.place) !==
      (router.query && router.query.place)
    ) {
      if (nextRouter.query.place) {
        const place = this.props.placeMap[nextRouter.query.place];
        if (place) this.setState({ place });
        else
          this.getPlaceDetails(nextRouter.query.place).then(place =>
            this.setState({ place })
          );
      }
    }
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
            <SelectedPlaceContext.Provider value={place}>
              <div className={"PagesWrapper"}>
                {error ? <LayoutError error={error} /> : children}
              </div>
            </SelectedPlaceContext.Provider>
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
          <SearchMobile
            onSelectLocation={this.handleSelectLocation}
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

  async handleSelectLocation(place = null, sessionToken) {
    this.props.dispatch(setSearchingGeohash(true));
    this.setState({ error: null });
    this.handleToggleSearch();

    const placeDetails = await this.getPlaceDetails(
      place && place.placeId,
      sessionToken
    );
    const geohash = getGeohash(placeDetails.location);

    this.props.dispatch(setSearchingGeohash(false));

    Router.push(
      {
        pathname: "/events",
        query: { position: geohash, place: placeDetails.place_id }
      },
      `/events/${slug(placeDetails.name, { lower: true })}`
    );

    /*
     * Google Analytics
     */
    let label;
    if (place) {
      label = place.placeId ? "Preselected place" : "Searched place";
    } else {
      label = "User position";
    }

    event({
      action: "Select Place",
      category: "Search",
      label,
      value: placeDetails.name
    });
  }

  async getPlaceDetails(placeId, sessionToken) {
    let placeDetails = this.props.placeMap[placeId];

    if (placeDetails) {
      this.props.dispatch(addPlace(placeDetails));
      return placeDetails;
    }

    try {
      if (!placeId) {
        const location = await getUserLocation();
        const place = await this.props.reverseGeocoding(location);
        placeId = place.place_id;
      }
      placeDetails = await this.props.getDetails(placeId, sessionToken);
    } catch (error) {
      console.log(error, placeId);
      this.setState({ error });
      return;
    }

    return placeDetails;
  }
}

function mapStateToProps(state) {
  return {
    searching: state.searching,
    placeMap: state.placeMap
  };
}

const LayoutWithRouter = withRouter(Layout);
const LayoutWithGoogleMaps = withGoogleMaps(LayoutWithRouter, true);

export default connect(mapStateToProps)(LayoutWithGoogleMaps);
