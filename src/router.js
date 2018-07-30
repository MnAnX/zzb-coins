import React from 'react';

import { TabNavigator, StackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'

// Screens
import Login from './screens/Login'
// Home Stack
import ZzbGroups from './screens/ZzbGroups'
import CreateNewGroup from './screens/CreateNewGroup'
import AddMember from './screens/AddMember'
import UserGroup from './screens/UserGroup'
import EarnZzb from './screens/EarnZzb'
import PayZzb from './screens/PayZzb'
import SubmitWork from './screens/SubmitWork'
import MyRecords from './screens/MyRecords'
import GroupRecords from './screens/GroupRecords'
import GroupInfo from './screens/GroupInfo'
import GroupMembers from './screens/GroupMembers'
import EditGroupInfo from './screens/EditGroupInfo'
import ScanQrCode from './screens/ScanQrCode'
// Notification Stack
import Notifications from './screens/Notifications'
import Vote from './screens/Vote'
// Profile Stack
import Profile from './screens/Profile'

export const HomeStack = StackNavigator({
  ZzbGroups:             { screen: ZzbGroups, navigationOptions: { title: 'ZZB Groups', headerLeft: null } },
  CreateNewGroup:        { screen: CreateNewGroup, navigationOptions: { title: 'Create New Group' } },
  AddMember:             { screen: AddMember, navigationOptions: { title: 'Add Member' } },
  UserGroup:             { screen: UserGroup },
  EarnZzb:               { screen: EarnZzb, navigationOptions: { title: 'Earn ZZB' } },
  PayZzb:                { screen: PayZzb, navigationOptions: { title: 'Pay ZZB' } },
  SubmitWork:            { screen: SubmitWork, navigationOptions: { title: 'Submit Work' } },
  MyRecords:             { screen: MyRecords, navigationOptions: { title: 'My Records' } },
  GroupRecords:          { screen: GroupRecords, navigationOptions: { title: 'Group Records' } },
  GroupInfo:             { screen: GroupInfo, navigationOptions: { title: 'Group Info' } },
  GroupMembers:          { screen: GroupMembers, navigationOptions: { title: 'Group Members' } },
  EditGroupInfo:         { screen: EditGroupInfo, navigationOptions: { title: 'Edit Group Info' } },
  ScanQrCode:            { screen: ScanQrCode, navigationOptions: { title: 'Scan QR Code' } },
});

export const NotificationsStack = StackNavigator({
  Notifications:    { screen: Notifications, navigationOptions: { title: 'Notifications' } },
  Vote:             { screen: Vote, navigationOptions: { title: 'Vote' } },
});

export const ProfileStack = StackNavigator({
  Profile:         { screen: Profile, navigationOptions: { title: 'Profile' } },
});

export const Tabs = TabNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon name='home' size={28} color={tintColor} />
    },
  },
  Notifications: {
    screen: NotificationsStack,
    navigationOptions: {
      tabBarLabel: 'Notifications',
      tabBarIcon: ({ tintColor }) => <Icon name='notifications' size={28} color={tintColor} />
    },
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => <Icon name='account-circle' size={28} color={tintColor} />
    },
  },
}, {
  tabBarOptions: {
    //showIcon: true,
    //labelStyle: {
      //fontSize: 10,
    //},
    //upperCaseLabel: false,
  },
});

export const Root = StackNavigator({
  Auth: {
    screen: Login,
  },
  Tabs: {
    screen: Tabs,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
});
