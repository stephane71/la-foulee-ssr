import { connect } from "react-redux";

import {
  GOOGLE_DETAILS_SERVICE,
  GOOGLE_GEOCODING_SERVICE,
  GOOGLE_AUTOCOMPLETE_SERVICE
} from "../enums";

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
      return (
        <>
          <WrappedComponent
            googleMapsServiceReady={
              this.props.googleMapsDetailsService &&
              this.props.googleMapsGeocodingService &&
              this.props.googleMapsAutocompleteService
            }
            getPredictions={this.getPredictions}
            getDetails={this.getDetails}
            reverseGeocoding={this.reverseGeocoding}
            {...this.props}
          />
        </>
      );
    }

    getPredictions(input, type = "cities") {
      return new Promise((resolve, reject) => {
        let options = { ...GOOGLE_MAPS_OPTIONS, input };
        if (type === "regions") options = { ...options, types: ["(regions)"] };

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
        state.googleMapsService[GOOGLE_GEOCODING_SERVICE],
      googleMapsAutocompleteService:
        state.googleMapsService[GOOGLE_AUTOCOMPLETE_SERVICE]
    };
  }

  return connect(mapStateToProps)(GoogleMaps);
};

export default withGoogleMaps;
