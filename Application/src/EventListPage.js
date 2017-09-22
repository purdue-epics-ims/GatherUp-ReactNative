import React, { Component, PropTypes as PT} from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput,
  ListView
} from 'react-native';

export default class EventListPage extends Component {

  static propTypes = {
    firebaseApp: PT.object.isRequired,
    title: PT.string.isRequired,
    onForwardEvent: PT.func,
    onBack: PT.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
    this.itemsRef = this.props.firebaseApp.database().ref().child('event');
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  renderItem(item) {
    return (
      <TouchableHighlight onPress={()=>this.props.onForwardEvent({id: item._key, name: item.name})}>
        <View style={eventstyles.EventListBox}>
          <Text>{item.name}</Text>
          <Text>{"ID: " + item.dateID}</Text>
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

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
     TouchableElement = TouchableNativeFeedback;
    }

    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderItem.bind(this)} />
     </View>
    );

  }

}

const eventstyles = StyleSheet.create({
  EventListBox: {
    flex: 1,
    height: 100,
    borderColor: 'black',
    borderWidth: 1,
  },
})
