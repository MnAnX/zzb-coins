import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, Image, View, StyleSheet, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash'

import { initUserVotesAndListeners } from '../actions/firebase'

const style = StyleSheet.create({
  container: {
    flex: 1
  },
});


class Notifications extends Component {
  constructor(props) {
    super(props);

    this.goToVote = this.goToVote.bind(this);
  }

  componentWillMount() {
    this.props.initVotes(this.props.user.info.id);
  }

  goToVote(vote) {
    this.props.navigation.navigate('Vote', {vote});
  }

  render() {
    return (
      <View style={style.container}>
        <ScrollView>
          <List containerStyle={{marginTop: 0}}>
            { _.values(this.props.notifications.votes).map((vote, i) => {
                if(vote) {
                  let record = vote.record;
                  let title = `${record.user_id} ${record.action} on ${record.name}`
                  let subtitle = `${record.action} ZZBs: ${record.amount}`
                  return (
                    <ListItem
                      key={i}
                      title={title}
                      subtitle={subtitle}
                      rightTitle='Vote'
                      onPress={()=>{this.goToVote(vote)}}
                    />
                  )
                }
              })
            }
          </List>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user, notifications }, props) => ({
  ...props.navigation.state.params,
  user,
  notifications,
});

const mapDispatchToProps = (dispatch) => ({
  initVotes: (userId) => {
    dispatch(initUserVotesAndListeners(userId))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
