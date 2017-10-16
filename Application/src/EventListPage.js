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
  ListView,
  Image
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
          <Text style = {eventstyles.eventTextDate}>{item.dateID}</Text>
          <Text style = {eventstyles.eventTextName}>{item.name}</Text>
          <Text style = {eventstyles.eventTextDesc}>{item.description}</Text>
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
      <View style={eventstyles.container}>
		<Image
          source={require('./icon.png')}
		  style={eventstyles.backgroundPic}
        />
        <ListView
		  style={eventstyles.eventList}
          dataSource={this.state.dataSource}
          renderRow={this.renderItem.bind(this)} 
		/>
     </View>
    );

  }

}

const eventstyles = StyleSheet.create({
  container: {
	flex: 1,
    flexDirection: 'column',
	justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(51,51,51)',
  },
  EventListBox: {
    flex: 1,
    height: 135,
	width: 375,
    borderColor: 'rgb(51,51,51)',
	backgroundColor: 'rgb(33,33,33)',
    borderWidth: 1,
	marginBottom: 10,
	borderRadius: 5,
  },
  eventList: {
	marginTop: 50,
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
	margin: 10,
  },
  eventTextDate: {
	fontSize: 16,
	color: 'white',
	textAlign: 'right',
  },
  backgroundPic: {
	height: 350,
	width: 490,
	position: 'absolute',
	bottom: -10,
  },
})
