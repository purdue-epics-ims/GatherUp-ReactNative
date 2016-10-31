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
  View,
  Navigator
} from 'react-native';

import AttendancePage from './src/AttendancePage';
import LoginFields from './src/LoginPage';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBpBEVFlT7PpcPq3ZA_Yj0U6Lq1vQfvq0c",
  authDomain: "dazzling-inferno-9963.firebaseapp.com",
  databaseURL: "https://dazzling-inferno-9963.firebaseio.com",
  storageBucket: "gs://dazzling-inferno-9963.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

class Application extends Component {
  render() {

    const routes = [
      {title: 'Login Page', index: 0},
      {title: 'Event List', index: 1},
      {title: 'Attendance Page', index: 2}
    ];

    return (
      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={routes}
        configureScene={() => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        renderScene={(route, navigator) => {
          <LoginFields
            title={routes[0].title}
            onForward={() => {
              const nextIndex = route.index + 1;
              navigator.push({

              });
            }}

            onBack={() => {
              if (route.index > 0) {
                navigator.pop();
              }
            }}
            />

      }}
      />
    );
  }
}


AppRegistry.registerComponent('Application', () => Application);
