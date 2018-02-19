import moment from 'moment';
import { createStore } from 'redux';

import {
  SET_SELECTED_EVENT,
  CONCAT_EVENT_LIST,
  SET_EVENT_LIST,
  SET_EVENT_LIST_NB_PAGES,
  SET_SELECTORS,
  SET_CURRENT_PAGE,
  SET_NEXT_MONTH
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

const initialState = {
  event: null,
  events: [],
  pages: 0,
  selectors: {
    month: START_MONTH,
    dep: ''
  },
  currentPage: 0
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
    case SET_NEXT_MONTH:
      const selectors = {
        ...state.selectors,
        month: getNextMonth(state.selectors.month)
      };
      return { ...state, selectors };
    default:
      return state;
  }
};

export const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};
