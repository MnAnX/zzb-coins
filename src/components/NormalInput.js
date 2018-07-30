import React from 'react';
import { View } from 'react-native'
import { FormLabel, FormInput } from 'react-native-elements'

export default ({label, value, onChange, ...props}) => {
  return (
    <View>
      <FormLabel>{label}</FormLabel>
      <FormInput returnKeyType={'done'} value={value} onChangeText={onChange} {...props}/>
    </View>
  );
};
