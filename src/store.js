import { createStore } from 'redux';

const initialState = {
  selectedEvent: null,
  events: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONCAT_EVENT_LIST':
      return { ...state, events: state.events.concat(action.events) };
    case 'SET_EVENT_LIST_NB_PAGES':
      return { ...state, pages: action.pages };
    default:
      return state;
  }
};

export const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};
