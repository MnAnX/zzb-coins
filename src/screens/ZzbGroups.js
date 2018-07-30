import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash'

import NormalButton from '../components/NormalButton'

import Config from '../config';
import { initGroupsDataAndListeners } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 10
  }
});


class ZzbGroups extends Component {
  constructor(props) {
    super(props);

    this.createNewGroup = this.createNewGroup.bind(this);
    this.goToUserGroup = this.goToUserGroup.bind(this);
  }

  componentWillMount() {
    this.props.initGroups(this.props.user.info.id);
  }

  createNewGroup() {
    this.props.navigation.navigate('CreateNewGroup');
  }

  goToUserGroup(groupId, groupName) {
    this.props.navigation.navigate('UserGroup', {title: groupName, groupId});
  }

  render() {
    return (
      <View style={style.container}>
        <ScrollView>
          <List containerStyle={{marginTop: 0}}>
            { _.values(this.props.groups.groups).map((group, i) => {
                if(group) {
                  var avatar = !_.isEmpty(group.avatar) ? group.avatar : Config.app.defaultGroupAvatar;
                  let members = `members: ${group.members ? group.members.length : 0}`
                  return (
                    <ListItem
                      key={i}
                      title={group.name}
                      subtitle={members}
                      avatar={{uri: avatar}}
                      roundAvatar={true}
                      onPress={()=>{this.goToUserGroup(group.group_id, group.name)}}
                    />
                  )
                }
              })
            }
          </List>
        </ScrollView>
        <View style={style.button}>
          <NormalButton title='Create New Group' onPress={()=>this.createNewGroup()} />
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
  initGroups: (userId) => {
    dispatch(initGroupsDataAndListeners(userId))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ZzbGroups);
