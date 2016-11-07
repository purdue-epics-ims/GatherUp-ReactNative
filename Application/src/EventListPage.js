import React, { Component, PropTypes as PT } from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput
} from'react-native';

import ListView from 'react-native';

export default class EventListPage extends Component {

  static propTypes = {
    firebaseApp: PT.object.isRequired,
    title: PT.string.isRequired,
    onForward: PT.func,
    onBack: PT.func
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
    this.itemsRef = this.props.firebaseApp.database().ref();
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
          schema: child.val().schema,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
    });
  }

  render() {

    console.log(this.state.dataSource)

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
