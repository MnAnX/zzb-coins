import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import user from './user';
import groups from './groups';
import notifications from './notifications';

const errors = (state = {}, action) => {
  switch(action.type) {
    case "REQUEST_FAILED":
      return {
        ...state,
        error: action.error
      }
    default:
      return state;
  }
};

const config = {
  key: 'primary',
  storage
}

const appReducer = persistCombineReducers(config, {
  errors,
  user,
  groups,
  notifications,
});

export default (state, action) => {
  if(action.type === "LOG_OUT") {
    state = {};
  }

  return appReducer(state, action);
};
