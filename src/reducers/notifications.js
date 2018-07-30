import {
  REFRESH_VOTES,
  ADD_VOTE,
  REMOVE_VOTE,
} from '../actions/notifications';

const defaultState = {
  votes: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case REFRESH_VOTES:
      return {
        ...state,
        votes: action.votes
      };
    case ADD_VOTE:
      return {
        ...state,
        votes: {
          ...state.groups,
          [action.recordId]: action.vote
        }
      };
    case REMOVE_VOTE: {
        const newState = Object.assign({}, state);
        delete newState.votes[action.recordId];
        return newState;
      }
    default:
      return state;
  }
};
