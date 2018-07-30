import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

const style = StyleSheet.create({
  text: {
    margin: 20,
    color: 'lightseagreen'
  },
});

export default ({children}) => {
  return (
    <Text style={style.text}>{children}</Text>
  );
};
