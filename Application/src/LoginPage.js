import React, { Component, PropTypes as PT } from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput,
  AsyncStorage,
  Image,
  Button
} from'react-native';



export default class LoginFields extends Component {

  static propTypes = {
    firebaseApp: PT.object.isRequired,
    title: PT.string.isRequired,
    onForward: PT.func,
    onBack: PT.func
  }

  constructor(props) {
    super(props);
    this.state = {
      emailString: '',
      passwordString: ''
    };

  }



  render() {

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
     TouchableElement = TouchableNativeFeedback;
    }

    return (
      <View style={styles.container}>
	  <Image style={styles.logoPic}
          source={require('./logo.png')}
        />
        <TextInput style={styles.input}
          placeholder = "username"
          placeholderTextColor = '#22F0DD'
		  underlineColorAndroid= '#22F0DD'
          onChangeText = {(text) => {this.setState({emailString: text}); console.log(text)}}
          />
        <TextInput style={styles.input}
          secureTextEntry = {true}
          placeholder = "password"
          placeholderTextColor = '#22F0DD'
		  underlineColorAndroid= '#22F0DD'
          onChangeText = {(text) => {this.setState({passwordString: text}); console.log(text)}}
        />
		{/*<Button onPress={this.login.bind(this)} title="Log In" color="#22F0DD">
		</Button>*/}
		<Button onPress={this.login.bind(this)} title="Log In" color='rgb(102,102,102)'>
		</Button>
       <Image style={styles.backgroundPic}
          source={require('./icon.png')}
        />
      </View>
    );
  }

  login(){

    this.props.firebaseApp.auth().signInWithEmailAndPassword(this.state.emailString, this.state.passwordString
    ).then((userData) =>
      {
        this.props.onForward();
      }
    ).catch((error) =>
    {
        alert('Login Failed. Please try again');
    });

}

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgb(51,51,51)',
  },
  welcome: {
    color: '#22F0DD',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
      width: 365,
      textAlign: 'left',
	  alignSelf: 'center',
      alignItems: 'center',
	  fontSize: 20,
	  color: '#22F0DD',
  },
  submitbutton: {
    alignItems: 'center',
	backgroundColor: '#22F0DD',
	width:150,
	height:50,
	justifyContent: 'center',
    alignItems: 'center',
  },
  submittext: {
	borderWidth: 1,
	fontSize: 20,
	color: 'rgb(51,51,51)',
  },
  logoPic: {
	  height: 160,
	  width: 160,
	  margin: 15,
  },
  backgroundPic: {
	  alignSelf: 'stretch',
      alignItems: 'flex-start',
	  marginLeft: 95,
	  position: 'absolute',
	  bottom: -10,
	  height: 350,
	  width: 490,
  },
})
