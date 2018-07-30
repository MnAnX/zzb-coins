import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native'
import _ from 'lodash'
import firebase from 'react-native-firebase'
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-elements'

import NormalButton from '../components/NormalButton'
import NormalInfo from '../components/NormalInfo'
import NormalText from '../components/NormalText'
import Padding from '../components/Padding'

import { deleteGroup, userLeaveGroup } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 10
  },
  error: {
    margin: 20,
    color: 'red'
  },
  avatar: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200
  },
  modalButton: {
    width: 100,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20
  }
});


class GroupInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
      myRole: 'member',
      error: '',
    }

    this.editGroup = this.editGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.doDeleteGroup = this.doDeleteGroup.bind(this);
    this.deleteGroupModal = this.deleteGroupModal.bind(this);
    this.deleteInfoModal = this.deleteInfoModal.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
    this.doLeaveGroup = this.doLeaveGroup.bind(this);
    this.leaveGroupModal = this.leaveGroupModal.bind(this);
  }

  componentWillMount() {
    // get and listen on group
    var groupRef = firebase.database().ref('groups/' + this.props.groupId);
    groupRef.on('value', (snapshot)=>{
      let group = snapshot.val() ? snapshot.val() : {};
      this.setState({group})
      if(group.creator === this.props.user.info.id) {
        this.setState({myRole: 'owner'})
      }
    });
  }

  editGroup() {
    this.props.navigation.navigate('EditGroupInfo', {
      screenKey: this.props.navigation.state.key,
      groupId: this.props.groupId,
      group: this.state.group });
  }

  leaveGroup() {
    this.refs.leaveGroupModal.open()
  }

  doLeaveGroup() {
    this.props.userLeaveGroup(this.props.groupId, this.props.user.info.id)
    this.props.navigation.goBack(this.props.screenKey);
  }

  leaveGroupModal() {
    return(
      <Modal style={style.modal} ref={"leaveGroupModal"} swipeToClose={true}>
          <Text>Are you sure you want to leave this group?</Text>
          <View style={{flexDirection: 'row'}}>
            <Button title='Cancel' style={style.modalButton} onPress={()=>this.refs.leaveGroupModal.close()} />
            <Button title='Leave' style={style.modalButton} onPress={()=>this.doLeaveGroup()} />
          </View>
      </Modal>
    )
  }

  deleteGroup(numMembers) {
    if(numMembers > 1) {
      this.refs.deleteInfoModal.open()
    } else {
      this.refs.deleteGroupModal.open()
    }
  }

  doDeleteGroup() {
    this.props.deleteGroup(this.props.groupId, this.state.group)
    this.props.navigation.goBack(this.props.screenKey);
  }

  deleteGroupModal() {
    return(
      <Modal style={style.modal} ref={"deleteGroupModal"} swipeToClose={true}>
          <Text>Are you sure you want to delete this group?</Text>
          <View style={{flexDirection: 'row'}}>
            <Button title='Cancel' style={style.modalButton} onPress={()=>this.refs.deleteGroupModal.close()} />
            <Button title='Delete' style={style.modalButton} onPress={()=>this.doDeleteGroup()} />
          </View>
      </Modal>
    )
  }

  deleteInfoModal() {
    return(
      <Modal style={style.modal} ref={"deleteInfoModal"} swipeToClose={true}>
          <Text>You cannot delete this group, because there are more than 1 members still in this group.</Text>
          <Button title='OK' style={style.modalButton} onPress={()=>this.refs.deleteInfoModal.close()} />
      </Modal>
    )
  }

  render() {
    let roleStatement = `You are ${this.state.myRole} of the group`
    let numMembers = (this.state.group && this.state.group.members) ? this.state.group.members.length : 0;
    return (
      <View style={style.container}>
        <View style={style.container}>
          <Padding height={20} />
          <NormalText>{roleStatement}</NormalText>
          <Padding height={20} />
          <View>
            {!_.isEmpty(this.state.group.avatar) && <Image source={{uri: this.state.group.avatar}} style={style.avatar} />}
            <NormalInfo label='Group Name:' value={this.state.group.name} />
            <NormalInfo label='Notes: ' value={this.state.group.notes} />
            <NormalInfo label='Members: ' value={numMembers} />
          </View>
        </View>
        <View style={style.button}>
          {!_.isEmpty(this.state.error) &&
            <Text style={style.error}>{this.state.error}</Text>
          }
          <Padding height={20} />
          {this.state.myRole==='owner' &&
            <View>
              <NormalButton title='Edit Group' onPress={()=>this.editGroup()} />
              <Padding height={20} />
              <NormalButton title='Delete Group' onPress={()=>this.deleteGroup(numMembers)} />
            </View>
          }
          {this.state.myRole==='member' &&
            <View>
              <NormalButton title='Leave Group' onPress={()=>this.leaveGroup()} />
            </View>
          }
        </View>
        {this.deleteInfoModal()}
        {this.deleteGroupModal()}
        {this.leaveGroupModal()}
      </View>
    );
  }
}

const mapStateToProps = ({ user, groups }, props) => ({
  ...props.navigation.state.params,
  user,
  groups,
});

const mapDispatchToProps = (dispatch) => ({
  deleteGroup: (groupId, group) => {
    dispatch(deleteGroup(groupId, group))
  },
  userLeaveGroup: (groupId, userId) => {
    dispatch(userLeaveGroup(groupId, userId))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupInfo);
