import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import _ from 'lodash'
import ImagePicker from 'react-native-image-picker';
import { List, ListItem, Avatar } from 'react-native-elements'
import UUID from 'react-native-uuid';

import NormalButton from '../components/NormalButton'
import NormalInfo from '../components/NormalInfo'
import NormalText from '../components/NormalText'
import SmallButton from '../components/SmallButton'
import Padding from '../components/Padding'

import { addRecord, uploadPow, deleteFile } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 10
  },
});


class SubmitWork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pow: [],
    }

    this.addProofOfWork = this.addProofOfWork.bind(this)
    this.proofOfWorkList = this.proofOfWorkList.bind(this)
    this.submitWork = this.submitWork.bind(this)
  }

  addProofOfWork() {
    const imagePickerOptions = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 400,
      maxHeight: 400,
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
        let fileId = `${this.props.groupId}_${this.props.user.info.id}_${fileName}.jpg`;
        // upload image to firebase, get url back, and add to pow list
        this.props.uploadPow(fileId, photoUri, (url)=>{
          let newPow = this.state.pow;
          newPow.push(url);
          this.setState({pow: newPow})
        });
      }
    });
  }

  removePowItem(url) {
    let newPow = this.state.pow;
    newPow.splice(newPow.indexOf(url), 1);
    this.setState({pow: newPow});
    this.props.deleteFile(url);
  }

  proofOfWorkList() {
    return (
      <List>
        { this.state.pow.map((url, i) => {
            return (
              <ListItem
                key={i}
                avatar={{uri:url}}
                rightIcon={{name: 'delete'}}
                onPressRightIcon={()=>{this.removePowItem(url)}}
              />
            )
          })
        }
      </List>
    )
  }

  submitWork() {
    // create new earning record
    let record = {
      user_id: this.props.user.info.id,
      action: 'earn',
      name: this.props.name,
      notes: this.props.notes,
      rate: this.props.rate,
      time: this.props.time,
      amount: this.props.total,
      pow: this.state.pow,
      vote_result: -1,
    }
    // get all the members (except worker) to create voter list
    let voters = {}
    var groupData = this.props.groups.groups[this.props.groupId];
    groupData.members.forEach((userId)=>{
      if(userId !== this.props.user.info.id) {
        voters[userId] = {
          user_id: userId,
          vote_result: -1,
          voted: false,
        }
      }
    })
    // add voters to the record
    record.voters = voters;

    // add the record to database
    this.props.addRecord(this.props.groupId, record);

    // go back to group
    this.props.navigation.goBack(this.props.screenKey);
  }

  render() {
    let time = `${this.props.time} mins`
    let earned = `${this.props.total} ZZBs`
    return (
      <View style={style.container}>
        <View style={style.container}>
          <Padding height={20} />
          <View>
            <NormalInfo label='You worked on' value={this.props.name} />
            <NormalInfo label='For' value={time} />
            <NormalInfo label='Earned' value={earned} />
          </View>
          <Padding height={20} />
          <SmallButton title='Add Proof of Work' onPress={()=>{this.addProofOfWork()}} />
          <ScrollView>
            {this.proofOfWorkList()}
          </ScrollView>
        </View>
        <View style={style.button}>
          <NormalText>Your work will be voted by the group members once submitted</NormalText>
          <Padding height={20} />
          <NormalButton title='Submit Work' onPress={()=>this.submitWork()} />
        </View>
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
  addRecord: (groupId, record) => {
    dispatch(addRecord(groupId, record))
  },
  uploadPow: (fileId, data, callback) => {
    dispatch(uploadPow(fileId, data, callback))
  },
  deleteFile: (url) => {
    dispatch(deleteFile(url))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmitWork);
