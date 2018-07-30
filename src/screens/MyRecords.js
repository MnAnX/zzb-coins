import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, Image, View, StyleSheet, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash'
import firebase from 'react-native-firebase'

import { formatDate, getVoteResultIcon } from './utils'

const style = StyleSheet.create({
  container: {
    flex: 1
  },
});


class MyRecords extends Component {
  constructor(props) {
    super(props);

    this.state = {
      records: {}
    }
  }

  componentWillMount() {
    // get and listen on my records (latest 100)
    var myRecordsRef = firebase.database().ref('records/' + this.props.groupId)
                        .orderByChild("user_id").equalTo(this.props.user.info.id)
                        .limitToLast(100);
    myRecordsRef.on('value', (snapshot)=>{
      this.setState({records: snapshot.val()})
    });
  }

  render() {
    return (
      <View style={style.container}>
        <ScrollView>
          <List containerStyle={{marginTop: 0}}>
            { _.values(this.state.records).map((record, i) => {
                if(record) {
                  let amount = (record.action === 'pay') ? record.amountWithTl : record.amount;
                  let title = `${record.action.toUpperCase()} ${amount} ZZBs`
                  let date = formatDate(new Date(record.timestamp));
                  return (
                    <ListItem
                      key={i}
                      title={title}
                      subtitle={record.name}
                      leftIcon={getVoteResultIcon(record.vote_result)}
                      rightTitle={date}
                      hideChevron={true}
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

const mapStateToProps = ({ user }, props) => ({
  ...props.navigation.state.params,
  user,
});

export default connect(mapStateToProps)(MyRecords);
