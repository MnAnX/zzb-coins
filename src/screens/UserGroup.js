import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash'
import firebase from 'react-native-firebase'

import NormalButton from '../components/NormalButton'
import SmallButton from '../components/SmallButton'
import Padding from '../components/Padding'

import { initUserGroup, calculateGroupRecords } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  titleText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'darkslateblue'
  },
  titleZzb: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'lightseagreen'
  },
  avatar: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

class UserGroup extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
  });

  constructor(props) {
    super(props);

    this.state = {
      userGroup: {},
      group: {},
    }

    this.renderTitle = this.renderTitle.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.renderInfoList = this.renderInfoList.bind(this);
    this.refresh = this.refresh.bind(this);
    this.earn = this.earn.bind(this);
    this.pay = this.pay.bind(this);
    this.myRecords = this.myRecords.bind(this);
    this.groupRecords = this.groupRecords.bind(this);
    this.groupInfo = this.groupInfo.bind(this);
    this.groupMembers = this.groupMembers.bind(this);
  }

  componentWillMount() {
    this.props.initUserGroup(this.props.user.info.id, this.props.groupId);
    // get and listen on group
    firebase.database().ref('groups/' + this.props.groupId).on('value', (snapshot)=>{
      let group = snapshot.val() ? snapshot.val() : {};
      this.setState({group})
    });
  }

  componentWillReceiveProps(nextProps) {
    let userGroup = nextProps.user.userGroups[this.props.groupId]
    if (userGroup) {
      this.setState({userGroup});
    }
  }

  renderTitle() {
    return(
      <View style={{flexDirection: 'row', justifyContent: 'center', textAlign: 'center'}}>
        <Text style={style.titleText}>My ZZBs: </Text>
        <Text style={style.titleZzb}>{this.state.userGroup.zzb}</Text>
      </View>
    )
  }

  refresh() {
    // on refresh, trigger a calculation on all the unsolved group records
    this.props.calculateGroupRecords(this.props.groupId);
  }

  earn() {
    this.props.navigation.navigate('EarnZzb', { groupId: this.props.groupId });
  }

  pay() {
    this.props.navigation.navigate('PayZzb', { groupId: this.props.groupId });
  }

  myRecords() {
    this.props.navigation.navigate('MyRecords', { groupId: this.props.groupId });
  }

  groupInfo() {
    this.props.navigation.navigate('GroupInfo', {
      screenKey: this.props.navigation.state.key,
      groupId: this.props.groupId
    });
  }

  groupRecords() {
    this.props.navigation.navigate('GroupRecords', { groupId: this.props.groupId });
  }

  groupMembers() {
    this.props.navigation.navigate('GroupMembers', { groupId: this.props.groupId });
  }

  renderButtons() {
    return(
      <View>
        <SmallButton title='Refresh' onPress={()=>this.refresh()} />
        <Padding height={20} />
        <NormalButton title='Earn' onPress={()=>this.earn()} />
        <Padding height={20} />
        <NormalButton title='Pay' onPress={()=>this.pay()} />
      </View>
    )
  }

  renderInfoList() {
    return(
      <List>
        <ListItem title='My Records' leftIcon={{name: 'star'}} onPress={()=>this.myRecords()} />
        <ListItem title='Group Info' leftIcon={{name: 'info-outline'}} onPress={()=>this.groupInfo()} />
        <ListItem title='Group Members' leftIcon={{name: 'people'}} onPress={()=>this.groupMembers()} />
        <ListItem title='Group Records' leftIcon={{name: 'list'}} onPress={()=>this.groupRecords()} />
      </List>
    )
  }

  render() {
    return (
      <View style={style.container}>
        <ScrollView>
          <View style={style.container}>
            <Padding height={20} />
            {!_.isEmpty(this.state.group.avatar) && <Image source={{uri: this.state.group.avatar}} style={style.avatar} />}
            <Padding height={20} />
            {this.renderTitle()}
            <Padding height={40} />
            {this.renderButtons()}
            <Padding height={20} />
          </View>
          {this.renderInfoList()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user }, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = (dispatch) => ({
  initUserGroup: (userId, groupId) => {
    dispatch(initUserGroup(userId, groupId))
  },
  calculateGroupRecords: (groupId) => {
    dispatch(calculateGroupRecords(groupId))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserGroup);
