import { createStore } from 'redux';

import {
  SET_SELECTED_EVENT,
  CONCAT_EVENT_LIST,
  SET_EVENT_LIST,
  SET_EVENT_LIST_NB_PAGES,
  SET_SELECTORS,
  SET_CURRENT_PAGE
} from './actions';

const initialState = {
  event: null,
  events: [],
  pages: 0,
  selectors: {
    month: '0-2018',
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
    default:
      return state;
  }
};

export const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};
