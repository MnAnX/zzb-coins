import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import _ from 'lodash'

import NormalButton from '../components/NormalButton'
import NormalInput from '../components/NormalInput'
import NormalText from '../components/NormalText'
import Padding from '../components/Padding'

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 10
  }
});


class EarnZzb extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      notes: '',
      rate: '1',
      time: '10',
    }

    this.submitWork = this.submitWork.bind(this)
  }

  submitWork() {
    let total = parseInt(this.state.rate) * parseInt(this.state.time)
    this.props.navigation.navigate('SubmitWork', {
      screenKey: this.props.navigation.state.key,
      groupId: this.props.groupId,
      name: this.state.name,
      notes: this.state.notes,
      rate: this.state.rate,
      time: this.state.time,
      total: total ? total : 0
    });
  }

  render() {
    let willEarn = parseInt(this.state.rate) * parseInt(this.state.time)
    return (
      <ScrollView style={style.container}>
        <ScrollView style={style.container}>
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
            <View>
              <NormalInput label='Work Name' value={this.state.name} onChange={(text)=>{this.setState({name: text})}} />
              <NormalInput label='Notes' value={this.state.notes} onChange={(text)=>{this.setState({notes: text})}} />
              <NormalInput label='Rate (ZZBs/mins)' keyboardType='numeric' value={this.state.rate} onChange={(text)=>{this.setState({rate: text})}} />
              <NormalInput label='Time (mins)' keyboardType='numeric' value={this.state.time} onChange={(text)=>{this.setState({time: text})}} />
            </View>
            <NormalText>You will earn {willEarn ? willEarn : 0} ZZBs</NormalText>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={style.button}>
          <NormalButton title='Start the Clock' />
          <Padding height={10} />
          <NormalButton title='Already Completed' onPress={()=>this.submitWork()} />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ user }, props) => ({
  ...props.navigation.state.params,
  user,
});

export default connect(mapStateToProps)(EarnZzb);
