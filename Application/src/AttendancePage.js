import React, { Component, PropTypes as PT } from 'react';

import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  ListView
} from'react-native';

import Firebase from 'firebase';

export default class AttendancePage extends Component {

  static propTypes = {
  	onBack: PT.func,
  }

	constructor(props) {
    super(props);
    this.state = {
        puidString: '',
        firstNameString: '',
	      lastNameString: '',
	      emailString: ''
    };
  }

  render() {

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
     TouchableElement = TouchableNativeFeedback;
    }

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

        <TouchableElement onPress={this.onPressRegister.bind(this)}>
          <View style={styles.submitbutton}>
            <Text style={styles.submittext}>
              Submit
            </Text>
          </View>
       </TouchableElement>
      </View>
    );
  }


onPressRegister()
{
    {/*this.props.firebaseApp.auth().signInWithEmailAndPassword(this.state.emailString, this.state.passwordString
    ).then((userData) =>
      {
        alert("Login successful");
        this.props.onForward;
      }
    ).catch((error) =>
    {
        alert('L@ogin Failed. Please try again');
    });*/}


	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.emailString)) {//^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$)) { //Matches email
		//TODO: add way to verify added email does not exist in existing emails in firebase (user doesn't exist)
		newFirebaseApp.database().ref().push({
			       puid: this.state.puidString,
             lastname: this.state.lastNameString,
             firstname: this.state.firstNameString,
             email: this.state.email
          });
    }
    else { //Email is not a valid email format
		    alert('Email is not of a valid format. Please try again.');
	  }
}
}

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
