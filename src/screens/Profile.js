import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet } from 'react-native'
import _ from 'lodash'
import QRCode from 'react-native-qrcode';

import NormalButton from '../components/NormalButton'
import Padding from '../components/Padding'

import { logOut } from '../actions/user';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'darkslateblue',
    fontSize: 18
  },
  value: {
    color: 'lightseagreen',
    fontSize: 28,
    fontWeight: 'bold'
  },
  button: {
    margin: 10
  }
});


class Profile extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    this.props.logOut();
    this.props.navigation.navigate(
      'Auth'
    );
  }

  render() {
    let userId = this.props.user.info ? this.props.user.info.id : ''
    return (
      <View style={style.container}>
        <View style={style.content}>
          <View>
            <Text style={style.label}>User ID</Text>
            <Text style={style.value}>{userId}</Text>
          </View>
          <Padding height={40} />
          <QRCode
            value={userId}
            size={200} />
        </View>
        <View style={style.button}>
          <NormalButton title='Sign Out' onPress={()=>this.logOut()} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ user, groups }, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => {
    dispatch(logOut());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
