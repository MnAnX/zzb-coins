import React from 'react';
import { Button } from 'react-native-elements'

export default ({...props}) => {
  return (
    <Button
      {...props}
      raised
      backgroundColor='lightseagreen'
      underlayColor='grey' />
  );
};
