import React, { Component, PropTypes as PT } from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput,
  AsyncStorage,
  Image
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

        <TouchableElement onPress={this.login.bind(this)}>
          <View style={styles.submitbutton}>
            <Text style={styles.submittext}>
              Log In
            </Text>
          </View>
       </TouchableElement>
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
  },
  submitbutton: {
    margin: 15,
    alignItems: 'center',
	borderColor: 'rgb(51,51,51)',
    borderWidth: 1,
	backgroundColor: '#22F0DD',
	width:150,
	height:50,
	justifyContent: 'center',
    alignItems: 'center',
  },
  submittext: {
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
