import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput
} from'react-native';

import LinearGradient from 'react-native-linear-gradient';


export default class LoginFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Login Email'
    }
    this.state.passtext = {
      text: 'Password'
    }
  }

  render() {
    return (
      <LinearGradient locations = {[0, 1, 2]} colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome! Please login to continue.
        </Text>
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center'}}
          placeholder = "Login Email"
          placeholderTextColor = "black"
          onChangeText={(text) => this.setState({text})}
          //value={this.state.text}
        />
        <TextInput
          style={{width: 150, textAlign: 'center', alignItems: 'center',}}
          secureTextEntry = {true}
          placeholder = "Password"
          placeholderTextColor = "black"
          onChangeText={(text) => this.setState({text})}
          //value={this.state.passtext.text}
        />

        <View style={styles.submitbutton}>
          <Text style={styles.submittext}>
            Submit
          </Text>
        </View>

      </View>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  linearGradient: {
      flex: 1,
  },
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
