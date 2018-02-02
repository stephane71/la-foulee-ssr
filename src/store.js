import { createStore } from 'redux';

import {
  SET_SELECTED_EVENT,
  CONCAT_EVENT_LIST,
  SET_EVENT_LIST_NB_PAGES
} from './actions';

const initialState = {
  event: null,
  events: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_EVENT:
      return { ...state, event: action.event };
    case CONCAT_EVENT_LIST:
      return { ...state, events: state.events.concat(action.events) };
    case SET_EVENT_LIST_NB_PAGES:
      return { ...state, pages: action.pages };
    default:
      return state;
  }
};

export const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};
