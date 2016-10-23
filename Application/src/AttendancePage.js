import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput
} from'react-native';

import Firebase from 'firebase';
//import LinearGradient from 'react-native-linear-gradient';


export default class AttendancePage extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Swipe ID or enter manually.
        </Text>
        <TextInput
          style={{width: 100, textAlign: 'center', alignItems: 'center'}}
          secureTextEntry = {true}
          placeholder = "PUID"
          placeholderTextColor = "black"
        />
        <Text>
          Or:
        </Text>
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center',}}
          placeholder = "First Name"
          placeholderTextColor = "black"
        />
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center',}}
          placeholder = "Last Name"
          placeholderTextColor = "black"
        />
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center',}}
          placeholder = "Email"
          placeholderTextColor = "black"
        />

        <View style={styles.submitbutton}>
          <Text style={styles.submittext}>
            Submit
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  submitbutton: {
    margin: 15,
    alignItems: 'center',
    width: 75,
    height: 30,
    borderColor: 'black',
    borderWidth: 1,
  },
  submittext: {
    color: 'black',
  },
})
