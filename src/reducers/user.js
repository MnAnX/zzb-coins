import {
  REQUEST_FAILED,
  LOG_IN,
  LOG_OUT,
  UPDATE_USER_GROUP,
  REMOVE_USER_GROUP,
} from '../actions/user';

const defaultState = {
  loggedIn: false,
  info: {},
  userGroups: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOG_IN:
      return {
        loggedIn: true,
        info: action.user,
      };
    case LOG_OUT:
      return {
        loggedIn: false
      };
    case UPDATE_USER_GROUP:
      return {
        ...state,
        userGroups: {
          ...state.userGroups,
          [action.groupId]: action.userGroup
        }
      };
    case REMOVE_USER_GROUP: {
        const newState = Object.assign({}, state);
        delete newState.userGroups[action.groupId];
        return newState;
      }
    default:
      return state;
  }
};
