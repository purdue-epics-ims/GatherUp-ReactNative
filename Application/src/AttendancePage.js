import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput
} from'react-native';

import Firebase from 'firebase';

const firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  databaseURL: "<your-database-url>",
  storageBucket: "<your-storage-bucket>",,
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class AttendancePage extends Component {

	constructor(props) {
    super(props);
    this.state = {
      puidString: '',
      firstNameString: '',
	  lastNameString: '',
	  emailString: ''
    };

	{/*this.itemsRef = firebaseApp.database().ref();
	}*/}

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
		  onChangeText = {(text) => {this.setState({puidString: text})}}
        />
        <Text>
          Or:
        </Text>
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center',}}
          placeholder = "First Name"
          placeholderTextColor = "black"
		  onChangeText = {(text) => {this.setState({firstNameString: text})}}
        />
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center',}}
          placeholder = "Last Name"
          placeholderTextColor = "black"
		  onChangeText = {(text) => {this.setState({lastNameString: text})}}
        />
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center',}}
          placeholder = "Email"
          placeholderTextColor = "black"
		  onChangeText = {(text) => {this.setState({emailString: text})}}
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
