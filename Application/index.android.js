import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import AttendancePage from './src/AttendancePage';
import LoginFields from './src/LoginPage';
import EventListPage from './src/EventListPage'
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBpBEVFlT7PpcPq3ZA_Yj0U6Lq1vQfvq0c",
  authDomain: "dazzling-inferno-9963.firebaseapp.com",
  databaseURL: "https://dazzling-inferno-9963.firebaseio.com",
  storageBucket: "gs://dazzling-inferno-9963.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig, 'MainFirebase');

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {id: null, name: null}
    }
  };

  updateEvent(event) {
    this.setState({event: event});
  };

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
          const routeTitle = route.title;
          if (routeTitle === 'Login Page') {
            return (
              <LoginFields
                firebaseApp={firebaseApp}
                title={routes[0].title}
                onForward={() => {
                  const nextIndex = route.index + 1;
                  navigator.push({
                    title: routes[nextIndex].title,
                    index: nextIndex
                  });
                }}

                onBack={() => {
                  if (route.index > 0) {
                    navigator.pop();
                  }
                }}
                />
            );
          }
          else if (routeTitle === 'Event List') {
            return (
              <EventListPage
                firebaseApp={firebaseApp}
                title={routes[1].title}
                onForwardEvent={(event)=> {
                  const nextIndex = route.index + 1;
                  this.updateEvent(event);
                  navigator.push({
                    title: routes[nextIndex].title,
                    index: nextIndex
                  });
                }}

                onBack={() => {
                  if (route.index > 0) {
                    navigator.pop();
                  }
                }}
                 />
            );
          }
          else if (routeTitle === 'Attendance Page') {
            return (
              <AttendancePage
                firebaseApp={firebaseApp}
                title={routes[2].title}
                event={this.state.event}
                onForward={()=> {
                  }}

                onBack={() => {
                  if (route.index > 0) {
                    navigator.pop();
                  }
                }}
              />
            );
          }
        }}
      />
    );
  }
}


AppRegistry.registerComponent('Application', () => Application);
