import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, Image, View, StyleSheet, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import _ from 'lodash'
import firebase from 'react-native-firebase'

import { formatDate } from './utils'

const style = StyleSheet.create({
  container: {
    flex: 1
  },
});


class GroupRecords extends Component {
  constructor(props) {
    super(props);

    this.state = {
      records: {}
    }
  }

  componentWillMount() {
    // get and listen on group records, confirmed only (latest 100)
    var groupRecordsRef = firebase.database().ref('records/' + this.props.groupId)
                        .orderByChild("vote_result").equalTo(1)
                        .limitToLast(100);
    groupRecordsRef.on('value', (snapshot)=>{
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
                  let title = `${record.user_id} ${record.action} ${record.amount} ZZBs`
                  let date = formatDate(new Date(record.timestamp));
                  return (
                    <ListItem
                      key={i}
                      title={title}
                      subtitle={record.name}
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

export default connect(mapStateToProps)(GroupRecords);
