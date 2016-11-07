import React, { Component } from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  ListView,
  AppRegistry,
  TextInput
} from'react-native';

import Firebase from 'firebase';


export default class EventListPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
    this.itemsRef = firebaseApp.database().ref();
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  renderItem(item) {
    return (
      <TouchableHighlight>
        <View>
          <Text>{item.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', snap => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          name: child.val().name,
          description: child.val().description,
          dateID: child.val().dateID,
          schema: child.val().schema
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
    });
  }

  render() {

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
     TouchableElement = TouchableNativeFeedback;
    }

    return (
      <View style={styles.container}>
        <ListView
          datasource={this.state.dataSource}
          renderrow={this.renderItem.bind(this)} />
      </View>
    );
  }

};

const styles = StyleSheet.create({

})
