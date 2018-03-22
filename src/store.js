import moment from 'moment';
import { createStore } from 'redux';

import {
  LOCATION_FILTER,
  DATE_FILTER,
  DISTANCE_FILTER,
  DEFAULT_SELECTOR_VALUES
} from './enums';
import {
  SET_SELECTED_EVENT,
  CONCAT_EVENT_LIST,
  SET_EVENT_LIST,
  SET_EVENT_LIST_NB_PAGES,
  SET_SELECTORS,
  SET_CURRENT_PAGE,
  SET_CURRENT_MONTH,
  SET_GOOGLE_MAPS_SERVICE,
  SET_EVENT_LIST_READY_FLAG
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

const START_MONTH = `${moment().month()}-${moment().year()}`;

const LEGACY_SELECTORS = {
  month: START_MONTH,
  dep: ''
};

const initialState = {
  event: null,
  events: [],
  pages: 0,
  selectors: Object.assign({}, DEFAULT_SELECTOR_VALUES, LEGACY_SELECTORS),
  currentPage: 0,
  currentMonth: START_MONTH,
  googleMapsService: null,
  eventListReady: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_EVENT:
      return { ...state, event: action.event };
    case CONCAT_EVENT_LIST:
      return { ...state, events: state.events.concat(action.events) };
    case SET_EVENT_LIST:
      return { ...state, events: action.events };
    case SET_EVENT_LIST_NB_PAGES:
      return { ...state, pages: action.pages };
    case SET_SELECTORS:
      return { ...state, selectors: action.selectors };
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.currentPage };
    case SET_CURRENT_MONTH:
      return { ...state, currentMonth: getNextMonth(state.currentMonth) };
    case SET_GOOGLE_MAPS_SERVICE:
      return { ...state, googleMapsService: action.service };
    case SET_EVENT_LIST_READY_FLAG:
      return { ...state, eventListReady: true };
    default:
      return state;
  }
};

export const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};
