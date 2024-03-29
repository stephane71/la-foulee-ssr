import { connect } from "react-redux";

import {
  GOOGLE_DETAILS_SERVICE,
  GOOGLE_GEOCODING_SERVICE,
  GOOGLE_AUTOCOMPLETE_SERVICE
} from "../enums";
import { GM_PLACES_DETAILS_FIELDS } from "../sharedEnums";

const GOOGLE_MAPS_OPTIONS = {
  types: ["(cities)"],
  componentRestrictions: { country: "fr" }
};

const withGoogleMaps = (WrappedComponent, initService = false) => {
  class GoogleMaps extends React.Component {
    static displayName = `withGoogleMaps(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component"})`;

    constructor(props) {
      super(props);

      this.getPredictions = this.getPredictions.bind(this);
      this.getDetails = this.getDetails.bind(this);
      this.reverseGeocoding = this.reverseGeocoding.bind(this);
    }

    render() {
      const {
        googleMapsDetailsService,
        googleMapsGeocodingService,
        googleMapsAutocompleteService,
        ...props
      } = this.props;

      return (
        <>
          <WrappedComponent
            googleMapsServiceReady={
              googleMapsDetailsService &&
              googleMapsGeocodingService &&
              googleMapsAutocompleteService
            }
            getSessionToken={this.getSessionToken}
            getPredictions={this.getPredictions}
            getDetails={this.getDetails}
            reverseGeocoding={this.reverseGeocoding}
            {...props}
          />
        </>
      );
    }

    getSessionToken = () => new google.maps.places.AutocompleteSessionToken();

    getPredictions(input, sessionToken, type = "cities") {
      let options = {
        input,
        types: [`(${type})`],
        componentRestrictions: { country: "fr" }
      };

      if (sessionToken) options = { ...options, sessionToken };

      return new Promise((resolve, reject) => {
        this.props.googleMapsAutocompleteService.getPlacePredictions(
          options,
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(predictions);
            } else {
              console.warn("No results found", status);
              reject(status);
            }
          }
        );
      });
    }

    getDetails(placeId, sessionToken) {
      let options = { placeId, fields: GM_PLACES_DETAILS_FIELDS };
      if (sessionToken) options = { ...options, sessionToken };

      return new Promise((resolve, reject) => {
        this.props.googleMapsDetailsService.getDetails(
          options,
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
        state.googleMapsService[GOOGLE_GEOCODING_SERVICE],
      googleMapsAutocompleteService:
        state.googleMapsService[GOOGLE_AUTOCOMPLETE_SERVICE]
    };
  }

  return connect(mapStateToProps)(GoogleMaps);
};

export default withGoogleMaps;
