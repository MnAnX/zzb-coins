import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, Image, View, StyleSheet, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash'
import firebase from 'react-native-firebase'

import NormalButton from '../components/NormalButton'

import { addUserToGroup } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 10
  }
});


class GroupMembers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {
        members: []
      },
      myRole: 'member',
      error: ''
    }

    this.addMember = this.addMember.bind(this);
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

  addMember() {
    this.props.navigation.navigate(
      'AddMember',
      {
        funcAdd: (userId) => {
          if(!_.isEmpty(userId) && this.state.group.members.indexOf(userId) < 0) {
            // add member only if the user is not in the group yet
            this.props.addUserToGroup(this.props.groupId, userId)
          }
        }
      },
    );
  }

  render() {
    return (
      <View style={style.container}>
        <ScrollView>
          <List containerStyle={{marginTop: 0}}>
            { this.state.group.members.map((userId, i) => {
                if(userId) {
                  return (
                    <ListItem
                      key={i}
                      title={userId}
                      hideChevron={true}
                    />
                  )
                }
              })
            }
          </List>
        </ScrollView>
        <View style={style.button}>
          {this.state.myRole==='owner' &&
            <NormalButton title='Add Member' onPress={()=>this.addMember()} />
          }
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ user }, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = (dispatch) => ({
  addUserToGroup: (groupId, userId) => {
    dispatch(addUserToGroup(groupId, userId))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupMembers);
