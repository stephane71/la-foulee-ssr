import moment from 'moment';
import store from 'store';
import { createStore } from 'redux';

import {
  LOCATION_FILTER,
  DATE_FILTER,
  DISTANCE_FILTER,
  DEFAULT_SELECTOR_VALUES,
  GOOGLE_DETAILS_SERVICE,
  GOOGLE_AUTOCOMPLETE_SERVICE
} from './enums';
import {
  SET_SELECTED_EVENT,
  SET_EVENT_LIST,
  SET_SELECTORS,
  SET_GOOGLE_MAPS_SERVICE,
  SET_MEDIA_TYPE,
  SET_USER_POSITION,
  LOCAL_STORAGE_SET,
  TOGGLE_SEARCH,
  SET_EVENT_LIST_START_INDEX
} from './actions';

function getNextMonth(month) {
  let [monthNumber, year] = month.split('-');
  monthNumber = parseInt(monthNumber) + 1;
  if (monthNumber > 11) {
    monthNumber = 0;
    year = parseInt(year) + 1;
  }
  return `${monthNumber}-${year}`;
}

const EVENT_LIST_START_INDEX = 0;
const START_MONTH = `${moment().month()}-${moment().year()}`;
const LEGACY_SELECTORS = {
  month: START_MONTH,
  dep: ''
};

const initialState = {
  event: null,
  events: [],
  selectors: Object.assign({}, DEFAULT_SELECTOR_VALUES, LEGACY_SELECTORS),
  googleMapsService: {
    [GOOGLE_DETAILS_SERVICE]: null,
    [GOOGLE_AUTOCOMPLETE_SERVICE]: null
  },
  eventListReady: false,
  media: null,
  position: null,
  searching: false,
  eventListStartIndex: EVENT_LIST_START_INDEX
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_EVENT:
      return { ...state, event: action.event };
    case SET_EVENT_LIST:
      return { ...state, events: action.events };
    case SET_SELECTORS:
      return { ...state, selectors: action.selectors };
    case SET_GOOGLE_MAPS_SERVICE:
      const googleMapsService = {
        ...state.googleMapsService,
        [action.service]: action.value
      };
      return { ...state, googleMapsService: googleMapsService };
    case SET_MEDIA_TYPE:
      return { ...state, media: action.media };
    case SET_USER_POSITION:
      return { ...state, position: action.position };
    case LOCAL_STORAGE_SET:
      store.set(action.key, action.value);
      return state;
    case TOGGLE_SEARCH:
      return {
        ...state,
        searching:
          action.toggle === undefined ? !state.searching : action.toggle
      };
    case SET_EVENT_LIST_START_INDEX:
      return { ...state, eventListStartIndex: action.index };

    default:
      return state;
  }
};

export const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};
