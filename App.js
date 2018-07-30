import React, { Component } from 'react';
import { Provider, connect } from "react-redux";
import { Text } from 'react-native';

import { Root } from './src/router'
import configureStore from "./src/store";

Text.defaultProps.allowFontScaling = false;

const store = configureStore();

export default class App extends Component {
  constructor() {
    super();
    console.disableYellowBox = true;
  }

  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
