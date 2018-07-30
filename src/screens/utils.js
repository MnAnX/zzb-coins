import React from 'react'
import { Icon } from 'react-native-elements'
import _ from 'lodash'
import Config from '../config'

export function formatDate(date) {
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return year + '-' + months[monthIndex] + '-' + day;
}

export function getVoteResultIcon(voteResult) {
  switch(voteResult) {
    case 0:
      return {name: 'highlight-off', color: 'red'};
    case 1:
      return {name: 'check-circle', color: 'green'};
    default:
      return {name: 'help-outline', color: 'orange'};
  }
}

export function amountWithTransactionLost(amount) {
  let transactionLost = _.round(amount * Config.app.transactionLostRate);
  return (amount + transactionLost);
}
