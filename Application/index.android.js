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

import AttendancePage from './src/AttendancePage';
import LoginFields from './src/LoginPage';

class Application extends Component {
  render() {
    return (
      <LoginFields />
      //<AttendancePage />
    );
  }
}


AppRegistry.registerComponent('Application', () => Application);
