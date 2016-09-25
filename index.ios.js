/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  ScrollView,
  ListView,
  TextInput,
  Text,
  View
} from 'react-native';

class AwesomeProject2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'SearchTab',
    }
  }
  render() {
    return (
      <TabBarIOS
        unselectedTintColor="yellow"
        tintColor="white"
        barTintColor="darkslateblue">
        <TabBarIOS.Item
          systemIcon="search"
          selected={this.state.selectedTab === 'SearchTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'SearchTab',
            });
          }}>
          <SearchTab />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="search"
          selected={this.state.selectedTab === 'SearchTab2'}
          onPress={() => {
            this.setState({
              selectedTab: 'SearchTab2',
            });
          }}>
          <SearchTab />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
    /*
    
*/
}
class SearchTab extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      searchText: '六本木',      
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{marginTop: 40}} />
        <View style={{flex: 1, flexDirection: 'row',backgroundColor: '#FFFFFF',}}>
          <TextInput
            style={styles.searchText}
            onChangeText={(text) => this.setState({searchText: text})}
            value={this.state.searchText}
            />
          <Text
            style={styles.searchButton}
            onPress={() => this.onPressTitle(this, this.state.searchText)}
            >
            検索
          </Text>
        </View>
        <View style={{marginTop: 0}}>
          <Hits dataSource={this.state.dataSource} />
        </View>
        <Text style={styles.instructions}>
          {this.state.searchText}
        </Text>
      </View>
    );
  }
  onPressTitle(self, searchText) {
    fetch('http://localhost:9200/ldgourmet/_search', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'query': {
          'simple_query_string': {
            'query': searchText,
            'fields': ["_all"],
            'default_operator': 'and'
          },
        },
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson && responseJson.hits && responseJson.hits.hits) {
        let hits = responseJson.hits.hits.map(function(element, index, array) {
          return {
            'name': element._source.name,
            'description': element._source.description,
          };
        });
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        self.setState({dataSource: ds.cloneWithRows(hits)});
      }
    });
  }
}
class Hits extends Component {
  render() {
    return (
      <ScrollView style={styles.hitsScroll}>
        <ListView
          dataSource={this.props.dataSource}
          renderRow={(rowData) => <Hit hit={rowData} />}
          enableEmptySections={true}
          />
      </ScrollView>
    )
  }
}
class Hit extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.hit.name}</Text>
        <Text style={styles.description}>{this.props.hit.description}</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    // flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  hitsScroll: {
    marginTop: 10,
    marginBottom: 10,
    height: 300,
  },
  searchText: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    marginTop: 20,
    width: 200,
    height: 30,
  },
  searchButton: {
    fontSize: 20,
    padding: 5,
    textAlign: 'center',
    margin: 10,
    marginTop: 20,
    backgroundColor: 'rgba(200, 100, 100, 0.3)',
    width: 80,
    height: 30,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    color: '#888888',
    margin: 10,
  },
});

AppRegistry.registerComponent('AwesomeProject2', () => AwesomeProject2);
