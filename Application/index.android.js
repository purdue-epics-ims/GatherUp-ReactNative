/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import LoginFields from './src/LoginPage';

class Application extends Component {
  render() {
    return (
        <LoginFields />
    );
  }
}


AppRegistry.registerComponent('Application', () => Application);
