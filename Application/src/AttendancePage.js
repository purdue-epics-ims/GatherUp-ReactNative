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
  ListView,
  Image
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
	console.log("AttendancePage")
	console.log(this.props.event)
  }

  render() {

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
     TouchableElement = TouchableNativeFeedback;
    }

    return (
      <View style={styles.container}>
        <Image style={styles.backgroundPic}
          source={require('./icon.png')}
        />
		<View style={styles.header}>
		
			<Text style={styles.eventTextDate}>
			{this.props.event.dateID + "\n" + "\n"}
			</Text>
	  
			<Text style={styles.eventTextName}>
			{this.props.event.name}
			</Text>
		
			<Text style={styles.eventTextDesc}>
			{this.props.event.description}
			</Text>
	    </View>
		<View style={styles.floatingBox}>
			<Text style={styles.welcome}>
				Swipe PUID{"\n"}
				or{"\n"}
				Enter Attendee Information
			</Text>
			<TextInput
				style={{width: 100, textAlign: 'center', alignItems: 'center', color: '#22F0DD'}}
				secureTextEntry = {true}
				placeholder = "PUID"
				placeholderTextColor = '#22F0DD'
		        onChangeText = {(text) => {this.setState({puidString: text})}}
			/>
			<Text style ={{color: '#22F0DD'}}>
				And / Or:
			</Text>
			<TextInput
				style={{width: 150, textAlign: 'center', alignItems: 'center', color: '#22F0DD'}}
				placeholder = "First Name"
				placeholderTextColor = '#22F0DD'
		        onChangeText = {(text) => {this.setState({firstNameString: text})}}
			/>
			<TextInput
				style={{width: 150, textAlign: 'center', alignItems: 'center', color: '#22F0DD'}}
				placeholder = "Last Name"
				placeholderTextColor = '#22F0DD'
				onChangeText = {(text) => {this.setState({lastNameString: text})}}
			/>
			<TextInput
				style={{width: 150, textAlign: 'center', alignItems: 'center', color: '#22F0DD'}}
				placeholder = "Email"
				placeholderTextColor = '#22F0DD'
				onChangeText = {(text) => {this.setState({emailString: text})}}
			/>
			<View style={styles.submitbutton}>
				<Text style={styles.submittext}>
					Submit
				</Text>
			</View>
		</View>
        <TouchableElement onPress={()=>this.props.onBack()}>
          <View style={styles.eventbutton}>
			<Image source={require('./arrow.png')}/>
          </View>
        </TouchableElement>
      </View>
    );
  }


onPressRegister() {
	 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.emailString)) {//^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$)) { //Matches email
		//TODO: add way to verify added email does not exist in existing emails in firebase (user doesn't exist)

    var newPostKey = this.props.firebaseApp.database().ref().child('event').child(this.props.event.id).child('attendees').push().key;

    const puidtemp = this.state.puidString.includes('000000000') ? (this.state.emailString.endsWith('purdue.edu') ? '**********' : 'N/A') : (this.state.puidString);

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
        alert('Attendance recorded successfully!');
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
  header: {
	width: 420,
	height: 200,
	backgroundColor: 'rgb(33,33,33)',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'rgb(51,51,51)',
  },
  eventTextName: {
	fontSize: 20,
	margin: 10,
	marginRight: 80,
	color: 'white',
  },
  eventTextDesc: {
	fontSize: 16,
	color: 'white',
	textAlign: 'left',
	margin: 10,
  },
  eventTextDate: {
	fontSize: 16,
	color: 'white',
	textAlign: 'right',
  },
  eventbutton: {
    margin: 15,
    alignItems: 'center',
	justifyContent: 'center',
    width: 30,
    height: 30,
	top: 5,
	left: 5,
	position: 'absolute',
	backgroundColor: 'rgb(33,33,33)',
  },
  welcome: {
    color: 'rgb(38,195,180)',
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
    margin: 5,
    alignItems: 'center',
    width: 80,
    height: 30,
	backgroundColor: '#22F0DD',
	justifyContent: 'center',
  },
  submittext: {
    color: 'black',
  },
  backgroundPic: {
	height: 350,
	width: 490,
	position: 'absolute',
	bottom: -10,
	left: -165,
  },
  floatingBox: {
	position: 'absolute',
	height: 360,
	top: 160,
	left: 25,
	right: 25,
	backgroundColor: 'rgb(80,80,80)',
	alignItems: 'center',
  }
})
