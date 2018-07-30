import firebase from 'react-native-firebase'
import _ from 'lodash'
import Config from '../config'
import { updateUserGroup, removeUserGroup } from './user'
import { updateGroup, removeGroup } from './groups'
import { refreshVotes, addVote, removeVote } from './notifications'

export const initUser = (user) => async dispatch => {
  // if user didn't exist before, init in firebase db
  let userRef = firebase.database().ref('users/' + user.id);
  userRef.once('value', function(snap) {
    // insert only if user didn't exist
    if( snap.val() === null ) {
        userRef.set( {
          user_id: user.id,
          email: user.email,
          group: [],
        } );
    }
  });
}

export const initGroupsDataAndListeners = (userId) => async dispatch => {
  var userGroupsRef = firebase.database().ref('users/' + userId + '/groups');
  // init groups
  userGroupsRef.once('value', function(snapshot) {
    let userGroups = snapshot.val(); // all the groups this user is on
    if(userGroups) {
      userGroups.forEach((userGroup) => {
        let groupId = userGroup.group_id;
        // listen on data of each group
        firebase.database().ref('groups/' + groupId).on('value', function(snapshot) {
          dispatch(updateGroup(groupId, snapshot.val()));  // update group in redux
        });
      })
    }
  });
  // listen on user groups changes
  // new user group
  userGroupsRef.on('child_added', function(data) {
    let groupId = data.val().group_id;
    // when new user group being added, add listener, and update local redux
    firebase.database().ref('groups/' + groupId).on('value', function(snapshot) {
      dispatch(updateGroup(groupId, snapshot.val()));
    });
  });
  // remove user group
  userGroupsRef.on('child_removed', function(data) {
    let groupId = data.val().group_id;
    // when user group being removed, detach listener, and update local redux
    firebase.database().ref('groups/' + groupId).off();
    dispatch(removeGroup(groupId));
  });
}

export const initUserGroup = (userId, groupId) => async dispatch => {
  var userGroupRef = firebase.database().ref('users/' + userId + '/groups/' + groupId);
  // listen on user group data
  userGroupRef.on('value', function(snapshot) {
    dispatch(updateUserGroup(groupId, snapshot.val()));  // update user group in redux
  });
}

export const createNewGroup = (group) => async dispatch => {
  // create the new group
  var newGroupRef = firebase.database().ref('groups/').push();
  let newGroupId = newGroupRef.key;
  group["group_id"] = newGroupId;
  newGroupRef.set(group);

  // add new group to all the members
  let newUserGroup = {
    group_id: newGroupId,
    zzb: 0,
  }
  group.members.forEach((userId)=>{
    firebase.database().ref('users/' + userId + '/groups/' + newGroupId).set(newUserGroup);
  })
}

export const updateGroupInfo = (groupId, group) => async dispatch => {
  var groupRef = firebase.database().ref('groups/' + groupId);
  groupRef.update(group)
}

export const deleteGroup = (groupId, group) => async dispatch => {
  if(groupId) {
    firebase.database().ref('groups/' + groupId).remove();
    group.members.forEach((userId)=>{
      firebase.database().ref('users/' + userId + '/groups/' + groupId).remove();
    })
  }
}

export const userLeaveGroup = (groupId, userId) => async dispatch => {
  // remove the group from user
  firebase.database().ref('users/' + userId + '/groups/' + groupId).remove();
  // update group member list
  let groupRef = firebase.database().ref('groups/' + groupId);
  groupRef.once('value', (snapshot)=>{
    let group = snapshot.val();
    // remove user from members
    group.members.splice(group.members.indexOf(userId), 1);
    // update group
    groupRef.update(group);
  })
}

export const addUserToGroup = (groupId, userId) => async dispatch => {
  // add a new user group to user
  let userGroupRef = firebase.database().ref('users/' + userId + '/groups/' + groupId);
  userGroupRef.once('value', (snapshot)=>{
    // add only if user does not have user group yet (just in case)
    if( snapshot.val() === null ) {
      let newUserGroup = {
        group_id: groupId,
        zzb: 0,
      }
      userGroupRef.set(newUserGroup);
    }
  })
  // update group member list
  let groupRef = firebase.database().ref('groups/' + groupId);
  groupRef.once('value', (snapshot)=>{
    let group = snapshot.val();
    // add user to members
    group.members.push(userId);
    // update group
    groupRef.update(group);
  })
}

export const addRecord = (groupId, record) => async dispatch => {
  // Add the new record to records
  var newRecordRef = firebase.database().ref('records/' + groupId).push();
  let newRecordId = newRecordRef.key;
  record.record_id = newRecordId;
  record.timestamp = firebase.database.ServerValue.TIMESTAMP;  // set timestamp on the record
  newRecordRef.set(record);

  // Create new user vote record
  let {voters, ...simpleRecord} = record;
  let newUserVoteRecord = {
    group_id: groupId,
    record_id: newRecordId,
    voted: false,
    vote_result: -1,
    record: simpleRecord,
  }
  // Add record to all the voters
  _.values(record.voters).forEach((user)=>{
    firebase.database().ref('users/' + user.user_id + '/votes/' + newRecordId).set(newUserVoteRecord);
  })
}

export const initUserVotesAndListeners = (userId) => async dispatch => {
  var userVotesRef = firebase.database().ref('users/' + userId + '/votes');
  // init votes
  userVotesRef.on('value', function(snapshot) {
    // update local redux with all the vote records
    dispatch(refreshVotes(snapshot.val()));
  });
}

export const onVote = (groupId, recordId, userId, voteResult) => async dispatch => {
  // update record with voter's result
  var voterOnRecordRef = firebase.database().ref('records/' + groupId + '/' + recordId + '/voters/' + userId);
  voterOnRecordRef.update({
    voted: true,
    vote_result: voteResult,
  })

  // remove vote from user voters
  firebase.database().ref('users/' + userId + '/votes/' + recordId).remove();

  // if all the voters have voted, trigger a vote result calculation on the record, update final result and distribute zzb to participant(s)
  var recordRef = firebase.database().ref('records/' + groupId + '/' + recordId);
  recordRef.once('value').then((snapshot)=>{
    let record = snapshot.val();
    // check if the record hasn't been processed yet
    if(record.vote_result < 0) {
      // check all the voters
      let voters = _.values(record.voters)
      if(!_.some(voters, ['voted', false])) {
        // everyone voted. start calculate
        let finalResult = calculateVotes(voters);
        // update record with final result
        recordRef.update({
          vote_result: finalResult
        })
        // if final result is confirmed, distribute zzb to participant user(s)
        if(finalResult > 0) {
          distributeZzb(groupId, record);
        }
      }
    }
  });
}

export const calculateGroupRecords = (groupId) => async dispatch => {
  // calculate on all the unsolved group records
  let unsolvedRecordsRef = firebase.database().ref('records/' + groupId).orderByChild("vote_result").equalTo(-1);
  unsolvedRecordsRef.once('value', (snapshot)=>{
    let records = snapshot.val();
    if(records) {
      let currentTimestamp = (new Date).getTime();
      let votingPeriodMilli = Config.app.votingPeriod * 3600000;
      let cutTime = currentTimestamp - votingPeriodMilli;
      _.values(records).forEach((record)=>{
        // check each record, if timestamp is older than votingPeriod, calculate it.
        if(record.timestamp < cutTime) {
          let finalResult = calculateVotes(_.values(record.voters));
          // update record with final result
          firebase.database().ref('records/' + groupId + '/' + record.record_id).update({
            vote_result: finalResult
          })
          // if final result is confirmed, distribute zzb to participant user(s)
          if(finalResult > 0) {
            distributeZzb(groupId, record);
          }
        }
      })
    }
  })
}

export const uploadPow = (fileId, data, callback) => async dispatch => {
  let ref = firebase.storage().ref().child('users/pow/' + fileId);
  ref.put(data).then(function(snapshot) {
    console.log('POW file uploaded: ' + fileId);
    ref.getDownloadURL().then(function(url) {
      callback(url);
    }).catch(function(error) {
      console.log('Failed to get url of pow file: ' + error);
    });
  });
}

export const deleteFile = (url) => async dispatch => {
  let ref = firebase.storage().refFromURL(url);
  ref.delete().then(function() {
    console.log("File has been deleted: " + url)
  }).catch(function(error) {
    console.log("Failed to delete file: " + error)
  });
}

export const uploadGroupAvatar = (fileId, data, callback) => async dispatch => {
  let ref = firebase.storage().ref().child('users/avatar/group' + fileId);
  ref.put(data).then(function(snapshot) {
    console.log('Groupn avatar file uploaded: ' + fileId);
    ref.getDownloadURL().then(function(url) {
      callback(url);
    }).catch(function(error) {
      console.log('Failed to get url of group avatar file: ' + error);
    });
  });
}

// ----- Helpers -----

function calculateVotes(voters) {
  let totalVote = 0;
  voters.forEach((voter)=>{
    if(voter) {
      let singleVote = (voter.vote_result === -1) ? 1 : voter.vote_result;  // treat unvoted as confirmed
      totalVote = totalVote + singleVote;
    }
  })
  let totalResult = (totalVote / voters.length) > 0.5 ? 1 : 0;
  return totalResult;
}

function distributeZzb(groupId, record) {
  // resolve payer and payee depending on action cases
  let payer = null;
  let payee = null;
  switch (record.action) {
    case 'earn':
      payer = null;
      payee = record.user_id;
      break;
    case 'pay':
      payer = record.user_id;
      payee = record.user2
      break;
    case 'request':
      payer = record.user2;
      payee = record.user_id;
      break;
    default:
      break;
  }
  // substract amount from payer
  if(payer) {
    let payerRef = firebase.database().ref('users/' + payer + '/groups/' + groupId);
    payerRef.once('value', (snapshot)=>{
      // substract the amount with transaction lost for payer
      let newZzb = snapshot.val().zzb - record.amountWithTl;
      payerRef.update({
        zzb: newZzb
      })
    })
  }
  // add amount to payee
  if(payee) {
    let payeeRef = firebase.database().ref('users/' + payee + '/groups/' + groupId);
    payeeRef.once('value', (snapshot)=>{
      // no transaction lost on the payee side
      let newZzb = snapshot.val().zzb + record.amount;
      payeeRef.update({
        zzb: newZzb
      })
    })
  }
}
