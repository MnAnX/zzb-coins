import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'
import _ from 'lodash'

import NormalButton from '../components/NormalButton'
import SmallButton from '../components/SmallButton'
import NormalInput from '../components/NormalInput'
import Padding from '../components/Padding'
import { imagePicker } from '../components/CommonImagePicker'

import { updateGroupInfo, uploadGroupAvatar } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  member: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
    marginTop: 40,
  },
  avatar: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20
  }
});


class EditGroupInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: props.group.notes,
      avatar: props.group.avatar,
    }

    this.saveChanges = this.saveChanges.bind(this);
    this.addGroupAvatar = this.addGroupAvatar.bind(this);
  }

  saveChanges() {
    let group = {
      notes: this.state.notes,
      avatar: this.state.avatar,
    }
    this.props.updateGroupInfo(this.props.groupId, group);
    this.props.navigation.goBack();
  }

  addGroupAvatar() {
    imagePicker({maxWidth: 200, maxHeight: 200}, (photoUri, fileName)=>{
      let fileNameVal = fileName ? fileName : UUID.v4();
      let fileId = `${this.props.user.info.id}_${fileNameVal}.jpg`;
      // upload image to firebase, get url back, and add to pow list
      this.props.uploadGroupAvatar(fileId, photoUri, (url)=>{
        this.setState({avatar: url})
      });
    })
  }

  render() {
    return (
      <ScrollView style={style.container}>
        <ScrollView style={style.container}>
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
            <View>
              <NormalInput label='Group Name' value={this.props.group.name} editable={false} />
              <NormalInput label='Notes' value={this.state.notes} onChange={(text)=>{this.setState({notes: text})}} />
            </View>
            <Padding height={20} />
            <SmallButton title='Group Avatar' onPress={()=>{this.addGroupAvatar()}} />
            {!_.isEmpty(this.state.avatar) && <Image source={{uri: this.state.avatar}} style={style.avatar} />}
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={style.button}>
          <NormalButton title='Save' onPress={()=>{this.saveChanges()}} />
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
  updateGroupInfo: (groupId, group) => {
    dispatch(updateGroupInfo(groupId, group))
  },
  uploadGroupAvatar: (fileId, data, callback) => {
    dispatch(uploadGroupAvatar(fileId, data, callback))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupInfo);
