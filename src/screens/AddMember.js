import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet } from 'react-native'
import _ from 'lodash'
import firebase from 'react-native-firebase'

import NormalText from '../components/NormalText'
import NormalButton from '../components/NormalButton'
import SmallButton from '../components/SmallButton'
import NormalInput from '../components/NormalInput'
import Padding from '../components/Padding'

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 10
  },
  userNotFoundText: {
    margin: 20,
    color: 'red'
  },
  userFoundText: {
    margin: 20,
    color: 'lightseagreen',
    fontSize: 22,
  },
});


class AddMember extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputUserId: '',
      foundUserId: '',
      result : 0,
    }

    this.addMember = this.addMember.bind(this);
    this.search = this.search.bind(this);
    this.scanQrCode = this.scanQrCode.bind(this);
  }

  search(userId) {
    if(!_.isEmpty(userId)) {
      firebase.database().ref('users/' + userId).once('value').then((snapshot)=>{
        if( snapshot.val() === null ) {
          this.setState({
            result: -1,
            foundUserId: ''
          });
        } else {
          let user = snapshot.val();
          this.setState({
            result: 1,
            foundUserId: user.user_id
          });
        }
      });
    }
  }

  addMember() {
    this.props.navigation.state.params.funcAdd(this.state.foundUserId);
    this.props.navigation.goBack();
  }

  scanQrCode() {
    this.props.navigation.navigate('ScanQrCode', {
      funcRead: (value)=>{
        let userId = value.data;
        // search on userId
        this.search(userId);
      }
    });
  }

  render() {
    return (
      <View style={style.container}>
        <Padding height={40} />
        <NormalButton title='Scan QR Code' onPress={()=>this.scanQrCode()} />
        <Padding height={20} />
        <NormalInput label='Or, search by User ID (case sensitive)' value={this.state.inputUserId} onChange={(text)=>{this.setState({inputUserId: text})}} />
        <Padding height={20} />
        <SmallButton title='Search' onPress={()=>{this.search(this.state.inputUserId)}} />
        <Padding height={20} />
        { (this.state.result < 0) &&
          <Text style={style.userNotFoundText}>User is NOT found</Text>
        }
        { (this.state.result > 0) &&
          <View>
            <Text style={style.userFoundText}>Found User: <Text style={{fontWeight: 'bold'}}>{this.state.foundUserId}</Text></Text>
            <Padding height={10} />
            <View style={style.button}>
              <NormalButton title='Add Member' onPress={()=>this.addMember()} />
            </View>
          </View>
        }
      </View>
    );
  }
}

const mapStateToProps = ({ user, groups }, props) => ({
  ...props.navigation.state.params,
  user,
});

export default connect(mapStateToProps)(AddMember);
