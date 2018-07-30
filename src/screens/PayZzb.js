import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import _ from 'lodash'

import NormalButton from '../components/NormalButton'
import NormalInput from '../components/NormalInput'
import NormalText from '../components/NormalText'
import Padding from '../components/Padding'

import Config from '../config'
import { amountWithTransactionLost } from './utils'
import { addRecord } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 10
  },
  error: {
    margin: 20,
    color: 'red'
  },
});


class PayZzb extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      notes: '',
      amount: '10',
      toMember: '',
      error: '',
    }

    this.submit = this.submit.bind(this)
  }

  submit() {
    let error = '';
    this.setState({error}); // reset error
    let amountWithTl = amountWithTransactionLost(parseInt(this.state.amount))
    // validate before submitting
    // check if ToMember is valid and belong to the same group
    var groupData = this.props.groups.groups[this.props.groupId];
    let isValidMember = _.some(groupData.members, this.state.toMember);
    if(!isValidMember) {
      error = `User ${this.state.toMember} is not valid or a member of the group!`
      this.setState({error});
    }
    if(_.isEmpty(this.state.toMember)) {
      error = `Please specify a group member as payee!`
      this.setState({error});
    }
    // check if user has enough ZZBs to pay
    var userGroupData = this.props.user.userGroups[this.props.groupId];
    let hasEnoughZzb = userGroupData.zzb > amountWithTl;
    if(!hasEnoughZzb) {
      error = `You do not have enough ZZB for the payment!`
      this.setState({error});
    }

    if(_.isEmpty(error)) {
      // create new earning record
      let record = {
        user_id: this.props.user.info.id,
        action: 'pay',
        name: this.state.name,
        notes: this.state.notes,
        amount: this.state.amount,
        amountWithTl,
        vote_result: -1,
      }
      // set voters to be the To Member
      let voters = {}
      voters[this.state.toMember] = {
        user_id: this.state.toMember,
        vote_result: -1,
        voted: false,
      }
      record.voters = voters;

      // add the record to database
      this.props.addRecord(this.props.groupId, record);

      // go back to group
      this.props.navigation.goBack();
    }
  }

  render() {
    let transactionLostPercent = Config.app.transactionLostRate * 100;
    let willPay = amountWithTransactionLost(parseInt(this.state.amount))
    return (
      <ScrollView style={style.container}>
        <ScrollView style={style.container}>
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
            <View>
              <NormalInput label='Item Name' value={this.state.name} onChange={(text)=>{this.setState({name: text})}} />
              <NormalInput label='Notes' value={this.state.notes} onChange={(text)=>{this.setState({notes: text})}} />
              <NormalInput label='To Group Member' value={this.state.toMember} onChange={(text)=>{this.setState({toMember: text})}} />
              <NormalInput label='Amount (ZZBs)' keyboardType='numeric' value={this.state.amount} onChange={(text)=>{this.setState({amount: text})}} />
            </View>
            <Padding height={10} />
            <NormalText>Payer pays extra {transactionLostPercent}% transaction lost. Payee will receive {this.state.amount} ZZBs. You will be charged {willPay} ZZBs.</NormalText>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={style.button}>
          {!_.isEmpty(this.state.error) &&
            <Text style={style.error}>{this.state.error}</Text>
          }
          <Padding height={20} />
          <NormalButton title='Submit' onPress={()=>this.submit()} />
        </View>
      </ScrollView>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PayZzb);
