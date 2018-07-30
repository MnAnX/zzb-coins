import {
  UPDATE_GROUP,
  REMOVE_GROUP,
  RESET_GROUPS,
} from '../actions/groups';

const defaultState = {
  groups: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_GROUP:
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.groupId]: action.group
        }
      };
    case REMOVE_GROUP: {
        const newState = Object.assign({}, state);
        delete newState.groups[action.groupId];
        return newState;
      };
    case RESET_GROUPS: {
        return {
          ...state,
          groups: {}
        };
      }
    default:
      return state;
  }
};
