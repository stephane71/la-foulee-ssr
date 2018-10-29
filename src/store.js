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
  SET_SEARCHING_GEOHASH,
  ADD_PLACE,
  SET_EVENTS_QUERY
} from "./actions";

function getNextMonth(month) {
  let [monthNumber, year] = month.split("-");
  monthNumber = parseInt(monthNumber) + 1;
  if (monthNumber > 11) {
    monthNumber = 0;
    year = parseInt(year) + 1;
  }
  return `${monthNumber}-${year}`;
}

const EVENT_LIST_START_INDEX = 0;

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
  searchingGeohash: false,
  placeMap: {},
  eventsQuery: {}
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
    case SET_SEARCHING_GEOHASH:
      return { ...state, searchingGeohash: action.searching };
    case ADD_PLACE:
      const place = action.place;
      if (!place) return state;
      return {
        ...state,
        placeMap: { ...state.placeMap, [place.place_id]: place }
      };
    case SET_EVENTS_QUERY:
      return { ...state, eventsQuery: action.query };

    default:
      return state;
  }
};

export const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};
