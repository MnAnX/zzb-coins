export const UPDATE_GROUP = 'UPDATE_GROUP';
export const REMOVE_GROUP = 'REMOVE_GROUP';
export const RESET_GROUPS = 'RESET_GROUPS';

const requestUpdateGroup = (groupId, group) => ({
  type: UPDATE_GROUP,
  groupId,
  group,
});

const requestRemoveGroup = (groupId) => ({
  type: REMOVE_GROUP,
  groupId,
});

const requestResetGroups = () => ({
  type: RESET_GROUPS,
});

export const updateGroup = (groupId, group) => async dispatch => {
  dispatch(requestUpdateGroup(groupId, group))
};

export const removeGroup = (groupId) => async dispatch => {
  dispatch(requestRemoveGroup(groupId))
};

export const resetGroups = () => async dispatch => {
  dispatch(requestResetGroups())
};
