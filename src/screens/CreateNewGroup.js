import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'
import _ from 'lodash'
import ImagePicker from 'react-native-image-picker';

import NormalButton from '../components/NormalButton'
import SmallButton from '../components/SmallButton'
import NormalInput from '../components/NormalInput'
import Padding from '../components/Padding'

import { createNewGroup, uploadGroupAvatar } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  member: {
    flexDirection: 'row',
  },
  button: {
    margin: 10
  },
  avatar: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20
  }
});


class CreateNewGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      notes: '',
      avatar: '',
      members: [],
    }

    this.createGroup = this.createGroup.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.memberList = this.memberList.bind(this);
    this.addGroupAvatar = this.addGroupAvatar.bind(this);
  }

  createGroup() {
    let creator = this.props.user.info.id;
    this.state.members.unshift(creator); // add yourself to the members
    let uniqueMembers = [...new Set(this.state.members)];
    let group = {
      name: this.state.name,
      notes: this.state.notes,
      avatar: this.state.avatar,
      members: uniqueMembers,
      creator,
    }
    this.props.createNewGroup(group);
    this.props.navigation.navigate('ZzbGroups');
  }

  addMember() {
    this.props.navigation.navigate(
      'AddMember',
      {
        funcAdd: (userId) => {
          let newMembers = this.state.members;
          newMembers.push(userId);
          this.setState({members: newMembers})
        }
      },
    );
  }

  removeMember(userId) {
    let newMembers = this.state.members;
    newMembers.splice(newMembers.indexOf(userId), 1);
    this.setState({members: newMembers});
  }

  memberList() {
    return (
      <List>
        { this.state.members.map((userId, i) => {
            return (
              <ListItem
                key={i}
                title={userId}
                rightIcon={{name: 'delete'}}
                onPressRightIcon={()=>{this.removeMember(userId)}}
              />
            )
          })
        }
      </List>
    )
  }

  addGroupAvatar() {
    const imagePickerOptions = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.8,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // file ID format: groupId_userId_fileName
        let photoUri = _.replace(response.uri, 'file:///', '');
        let fileName = response.fileName ? response.fileName : UUID.v4();
        let fileId = `${this.props.user.info.id}_${fileName}.jpg`;
        // upload image to firebase, get url back, and add to pow list
        this.props.uploadGroupAvatar(fileId, photoUri, (url)=>{
          this.setState({avatar: url})
        });
      }
    });
  }

  render() {
    return (
      <ScrollView style={style.container}>
        <ScrollView style={style.container}>
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
            <View>
              <NormalInput label='Group Name' value={this.state.name} onChange={(text)=>{this.setState({name: text})}} />
              <NormalInput label='Notes' value={this.state.notes} onChange={(text)=>{this.setState({notes: text})}} />
            </View>
            <Padding height={20} />
            <SmallButton title='Group Avatar' onPress={()=>{this.addGroupAvatar()}} />
            {!_.isEmpty(this.state.avatar) && <Image source={{uri: this.state.avatar}} style={style.avatar} />}
            <Padding height={20} />
            <SmallButton title='Add Members' onPress={()=>{this.addMember()}} />
            <ScrollView>
              {this.memberList()}
            </ScrollView>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={style.button}>
          <NormalButton title='Create Group' onPress={()=>{this.createGroup()}} />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ user }, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = (dispatch) => ({
  createNewGroup: (group) => {
    dispatch(createNewGroup(group))
  },
  uploadGroupAvatar: (fileId, data, callback) => {
    dispatch(uploadGroupAvatar(fileId, data, callback))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewGroup);
