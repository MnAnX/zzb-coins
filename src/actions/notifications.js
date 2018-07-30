export const REFRESH_VOTES = 'REFRESH_VOTES';
export const ADD_VOTE = 'ADD_VOTE';
export const REMOVE_VOTE = 'REMOVE_VOTE';

const requestRefreshVotes = (votes) => ({
  type: REFRESH_VOTES,
  votes,
});

const requestAddVote = (recordId, vote) => ({
  type: ADD_VOTE,
  recordId,
  vote
});

const requestRemoveVote = (recordId) => ({
  type: REMOVE_VOTE,
  recordId,
});

export const refreshVotes = (votes) => async dispatch => {
  dispatch(requestRefreshVotes(votes))
};

export const addVote = (recordId, vote) => async dispatch => {
  dispatch(requestAddVote(recordId, vote))
};

export const removeVote = (recordId) => async dispatch => {
  dispatch(requestRemoveVote(recordId))
};
