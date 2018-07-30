import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

const style = StyleSheet.create({
  container: {
    margin: 20,
    flexDirection: 'row'
  },
  label: {
    color: 'darkslateblue',
    fontSize: 18
  },
  value: {
    color: 'lightseagreen',
    fontSize: 18
  }
});

export default ({label, value}) => {
  return (
    <View style={style.container}>
      <Text style={style.label}>{label} </Text>
      <Text style={style.value}>{value}</Text>
    </View>
  );
};
