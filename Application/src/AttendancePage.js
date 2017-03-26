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
    firebaseApp: PT.object.isRequired,
    title: PT.string.isRequired,
  	onBack: PT.func,
    event: PT.object.isRequired
  }

	constructor(props) {
    super(props);
    this.state = {
        puidString: '0000000000',
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
          Event: {this.props.event.name}
        </Text>

        <TouchableElement onPress={()=>this.props.onBack()}>
          <View style={styles.eventbutton}>
            <Text style={styles.submittext}>
              Back to List of Events
            </Text>
          </View>
        </TouchableElement>

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
          And / Or:
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


onPressRegister() {
	 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.emailString)) {//^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$)) { //Matches email
		//TODO: add way to verify added email does not exist in existing emails in firebase (user doesn't exist)

    var newPostKey = this.props.firebaseApp.database().ref().child('event').child(this.props.event.id).child('attendees').push().key;

    const puidtemp = this.state.puidString.includes('0000000000') ? (this.state.emailString.endsWith('purdue.edu') ? '**********' : 'N/A') : (this.state.puidString)

    var updates = {
      puid: puidtemp,
      lastname: this.state.lastNameString,
      firstname: this.state.firstNameString,
      email: this.state.emailString
    };

    var path = {};
    path['/event/' + this.props.event.id + '/' + 'attendees/' + newPostKey] = updates;

    this.props.firebaseApp.database().ref().update(path).then((success) =>
      {
        alert('Attendance recorded successfully!')
      }
      ).catch((error) =>
      {
        alert('Attendance submission failed: Firebase update error');
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
  eventbutton: {
    margin: 15,
    alignItems: 'center',
    width: 200,
    height: 30,
    borderColor: 'black',
    borderWidth: 1,
  },
  welcome: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  backbutton: {
    margin: 15,
    alignItems: 'center',
    width: 75,
    height: 30,
    borderColor: 'black',
    borderWidth: 1,
  },
  submitbutton: {
    margin: 15,
    alignItems: 'center',
    width: 80,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
  },
  submittext: {
    color: 'black',
  },
})
