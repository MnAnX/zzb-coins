import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native'
import _ from 'lodash'
import { Button } from 'react-native-elements'

import NormalInfo from '../components/NormalInfo'
import Padding from '../components/Padding'

import { onVote } from '../actions/firebase';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    margin: 12,
    resizeMode: 'contain',
    minHeight: 300
  }
});


class Vote extends Component {
  constructor(props) {
    super(props);

    this.vote = this.vote.bind(this)
  }

  vote(voteResult) {
    // process vote result
    this.props.onVote(this.props.vote.group_id, this.props.vote.record_id, this.props.user.info.id, voteResult);
    // go back to notification
    this.props.navigation.goBack();
  }

  render() {
    let vote = this.props.vote;
    let details = vote.record.rate ? `${vote.record.rate} ZZBs/min * ${vote.record.time} mins` : '';
    return (
      <View style={style.container}>
        <View style={style.container}>
          <Padding height={20} />
          <ScrollView>
            <NormalInfo label='User: ' value={vote.record.user_id} />
            <NormalInfo label='Action: ' value={vote.record.action} />
            <NormalInfo label='ZZB: ' value={vote.record.amount} />
            <NormalInfo label='Work/Item Name: ' value={vote.record.name} />
            {!_.isEmpty(vote.record.notes) &&
              <NormalInfo label='Notes: ' value={vote.record.notes} />
            }
            {vote.record.rate &&
              <NormalInfo label='Details: ' value={details} />
            }
            {vote.record.pow &&
              <View>
                <NormalInfo label='Proof of Work: ' value='' />
                { vote.record.pow.map((url, i) => (
                    <Image source={{uri: url}} style={style.image} />
                  ))}
              </View>
            }
          </ScrollView>
        </View>
        <View style={style.button}>
          <Button raised large
            title='Confirm'
            backgroundColor='green'
            underlayColor='grey'
            onPress={()=>this.vote(1)}/>
          <Button raised large
            title='Disagree'
            backgroundColor='red'
            underlayColor='grey'
            onPress={()=>this.vote(0)}/>
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
  onVote: (groupId, recordId, userId, voteResult) => {
    dispatch(onVote(groupId, recordId, userId, voteResult))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Vote);
