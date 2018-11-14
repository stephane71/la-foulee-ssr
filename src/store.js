import { createStore } from "redux";

import {
  GOOGLE_DETAILS_SERVICE,
  GOOGLE_AUTOCOMPLETE_SERVICE,
  GOOGLE_GEOCODING_SERVICE
} from "./enums";
import {
  SET_SELECTED_EVENT,
  SET_EVENT_LIST,
  SET_GOOGLE_MAPS_SERVICE,
  SET_MEDIA_TYPE,
  TOGGLE_SEARCH,
  ADD_PLACE,
  SET_POSITION
} from "./actions";

const initialState = {
  event: null,
  events: [],
  googleMapsService: {
    [GOOGLE_DETAILS_SERVICE]: null,
    [GOOGLE_AUTOCOMPLETE_SERVICE]: null,
    [GOOGLE_GEOCODING_SERVICE]: null
  },
  media: null,
  searching: false,
  placeMap: {},
  position: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_EVENT:
      return { ...state, event: action.event };
    case SET_EVENT_LIST:
      return {
        ...state,
        events: action.events.filter(({ department }) => department)
      };
    case SET_GOOGLE_MAPS_SERVICE:
      const googleMapsService = {
        ...state.googleMapsService,
        [action.service]: action.value
      };
      return { ...state, googleMapsService: googleMapsService };
    case SET_MEDIA_TYPE:
      return { ...state, media: action.media };
    case TOGGLE_SEARCH:
      return {
        ...state,
        searching:
          action.toggle === undefined ? !state.searching : action.toggle
      };
    case ADD_PLACE:
      const place = action.place;
      if (!place || !place.slug) return state;
      return {
        ...state,
        placeMap: { ...state.placeMap, [place.slug]: place }
      };
    case SET_POSITION:
      return { ...state, position: action.position };

    default:
      return state;
  }
};

export const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};
