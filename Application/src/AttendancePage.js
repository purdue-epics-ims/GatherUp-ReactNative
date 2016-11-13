import React, { Component, PropTypes as PT } from 'react';

import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput
} from'react-native';

import Firebase from 'firebase';

static propTypes = {
	onBack: PT.func,
	eventName: PT.string.isRequired
}

/*const firebaseConfig = {
  apiKey: "<your-api-key>",
  authDomain: "<your-auth-domain>",
  databaseURL: "<your-database-url>",
  storageBucket: "<your-storage-bucket>",,
};
const firebaseApp = firebase.initializeApp(firebaseConfig);*/

const newFirebaseConfig = {
	apiKey: "AIzaSyBpBEVFlT7PpcPq3ZA_Yj0U6Lq1vQfvq0c",
	authDomain: "dazzling-inferno-9963.firebaseapp.com",
	databaseURL: "https://dazzling-inferno-9963.firebaseio.com/event/"+propTypes.eventName+"/attendees", //"https://dazzling-inferno-9963.firebaseio.com",
	storageBucket: "gs://dazzling-inferno-9963.appspot.com",
	weE};
const newFirebaseApp = firebase.initializeApp(newFirebaseConfig); 

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
};

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
	
	
	if (this.state.emailString.match(^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$)) { //Matches email 
		//TODO: add way to verify added email does not exist in existing emails in firebase (user doesn't exist)
		newFirebaseApp.database().ref().push({
			puid: this.state.puidString,
            lastname: this.state.lastNameString,
            firstname: this.state.firstNameString,
            email: this.state.email});
		
	} else { //Email is not a valid email format
		alert('Email is not of a valid format. Please try again.');
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
