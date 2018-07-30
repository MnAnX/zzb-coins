import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Image, View, StyleSheet, Platform } from 'react-native';
import Auth0 from 'react-native-auth0';
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase'

import NormalButton from '../components/NormalButton'

import Config from '../config';
import { login } from '../actions/user';
import { initUser } from '../actions/firebase';
import { resetGroups } from '../actions/groups';

const style = StyleSheet.create({
  logo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 10,
    marginBottom: 60
  }
});


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    }

    this.login = this.login.bind(this);
    this.initUser = this.initUser.bind(this);
    this.startApp = this.startApp.bind(this);
  }

  componentWillMount() {
    if (this.props.user.loggedIn) {
      this.startApp()
    }
  }

  login(user){
    if (user) {
      // write user info to local
      this.props.login(user);
      // init user
      this.props.initUser(user);
      // reset groups
      this.props.resetGroups();
      // start the app
      this.startApp()
    }
  }

  startApp() {
    // go to next screen
    this.props.navigation.navigate('ZzbGroups');
  }

  initUser(user) {
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

  render() {
    const auth0Login = () => {
      const auth0 = new Auth0({ domain: Config.auth0.domainName, clientId: Config.auth0.clientId });
      auth0
        .webAuth
        .authorize({scope: 'openid profile email', audience: 'https://zzb.auth0.com/userinfo'})
        .then((credentials) => {
            // Get user profile
            auth0
              .auth
              .userInfo({token: credentials.accessToken})
              .then((profile) => {
                // Login with profile data
                console.log('Logged in with Auth0! Profile: ', profile);
                if(profile){
                  this.login({
                    id: profile.nickname,
                    email: profile.email
                  });
                }
              })
              .catch(console.error);
          }
        )
        .catch(error => console.log(error));
    };

    let logo = (
      <Image style={{width: '80%', height: '80%'}} source={require('../resources/logo/logo-black.png')} />
    )
    if(Platform.OS === 'android') {
      logo = (
        <Image style={{width: '80%', height: '80%'}} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/zzbnow.appspot.com/o/app%2Fresources%2FZZB-logo-black.png?alt=media&token=3ca86e5a-8b64-4a8f-8f2b-fe647840b232'}} />
      )
    }

    return (
      <View style={{flex: 1}}>
        <View style={style.logo}>
          {logo}
        </View>
        <View style={style.button}>
          <NormalButton large
            title="Sign In"
            onPress={auth0Login}/>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => {
    dispatch(login(user))
  },
  initUser: (user) => {
    dispatch(initUser(user))
  },
  resetGroups: () => {
    dispatch(resetGroups())
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
