export const REQUEST_FAILED = 'REQUEST_FAILED';
export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const UPDATE_USER_GROUP = 'UPDATE_USER_GROUP'
export const REMOVE_USER_GROUP = 'REMOVE_USER_GROUP'

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestLogin = (user) => ({
  type: LOG_IN,
  user
});

const requestLogOut = () => ({
  type: LOG_OUT,
});

const requestUpdateUserGroup = (groupId, userGroup) => ({
  type: UPDATE_USER_GROUP,
  groupId,
  userGroup,
});

const requestRemoveUserGroup = (groupId) => ({
  type: REMOVE_USER_GROUP,
  groupId
});

export const logOut = () => dispatch => {
  dispatch(requestLogOut());
}

export const login = (user) => async dispatch => {
  dispatch(requestLogin(user));
};

export const updateUserGroup = (groupId, userGroup) => async dispatch => {
  dispatch(requestUpdateUserGroup(groupId, userGroup));
};

export const removeUserGroup = (groupId) => async dispatch => {
  dispatch(requestRemoveUserGroup(groupId));
};
