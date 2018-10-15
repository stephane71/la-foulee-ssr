import dynamic from "next/dynamic";
import { connect } from "react-redux";

import { GOOGLE_DETAILS_SERVICE, GOOGLE_GEOCODING_SERVICE } from "../enums";

const GoogleMapInitServices = dynamic(import("./GoogleMapInitServices"), {
  ssr: false,
  loading: () => null
});

const withGoogleMaps = (WrappedComponent, initService = false) => {
  class GoogleMaps extends React.Component {
    static displayName = `withGoogleMaps(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component"})`;

    constructor(props) {
      super(props);

      this.getDetails = this.getDetails.bind(this);
      this.reverseGeocoding = this.reverseGeocoding.bind(this);
    }

    render() {
      return (
        <>
          {initService && <GoogleMapInitServices />}

          <WrappedComponent
            googleMapsServiceReady={
              this.props.googleMapsDetailsService &&
              this.props.googleMapsGeocodingService
            }
            getDetails={this.getDetails}
            reverseGeocoding={this.reverseGeocoding}
            {...this.props}
          />
        </>
      );
    }

    getDetails(placeId) {
      return new Promise((resolve, reject) => {
        this.props.googleMapsDetailsService.getDetails(
          { placeId },
          (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              let { geometry, ...rest } = place;
              resolve({
                location: {
                  lat: geometry.location.lat(),
                  lng: geometry.location.lng()
                },
                ...rest
              });
            } else reject(status);
          }
        );
      });
    }

    reverseGeocoding(location) {
      return new Promise((resolve, reject) => {
        this.props.googleMapsGeocodingService.geocode(
          { location },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              const city = results.find(({ types }) =>
                types.includes("locality")
              );
              resolve({ ...city, placeId: city.place_id });
            } else reject(status);
          }
        );
      });
    }
  }

  function mapStateToProps(state) {
    return {
      googleMapsDetailsService: state.googleMapsService[GOOGLE_DETAILS_SERVICE],
      googleMapsGeocodingService:
        state.googleMapsService[GOOGLE_GEOCODING_SERVICE]
    };
  }

  return connect(mapStateToProps)(GoogleMaps);
};

export default withGoogleMaps;
