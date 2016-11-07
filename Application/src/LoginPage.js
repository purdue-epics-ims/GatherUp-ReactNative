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
  AsyncStorage
} from'react-native';


//import LinearGradient from 'react-native-linear-gradient';

// var emailstring = "NULL";
// var passwordstring = "NULL";

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
        <Text style={styles.welcome}>
          Welcome! Please login to continue.
        </Text>
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center'}}
          placeholder = "Login Email"
          placeholderTextColor = "black"
          onChangeText = {(text) => {this.setState({emailString: text}); console.log(text)}}
        />
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center',}}
          secureTextEntry = {true}
          placeholder = "Password"
          placeholderTextColor = "black"
          onChangeText = {(text) => {this.setState({passwordString: text}); console.log(text)}}
        />

        <TouchableElement onPress={this.login.bind(this)}>
          <View style={styles.submitbutton}>
            <Text style={styles.submittext}>
              Submit
            </Text>
          </View>
       </TouchableElement>

      </View>
    );
  }

  login(){

    this.props.firebaseApp.auth().signInWithEmailAndPassword(this.state.emailString, this.state.passwordString
    ).then((userData) =>
      {
        alert("Login successful");
        this.props.onForward;
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
