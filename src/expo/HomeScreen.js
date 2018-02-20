// @flow

import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Font} from 'expo';
import GrpcClient from './GrpcClient';

type Props = {
  navigation: {
    navigate(target: string, params: mixed): void,
  },
};
type State = {
  fontLoaded: boolean,
};

// TODO(mbolin): Read values from config.toml.
const HOSTNAME = 'raspberrypi.local';
const PORT = 8081;
const grpcClient = new GrpcClient(HOSTNAME, PORT);

export default class HomeScreen extends React.Component<Props, State> {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      // Font is from http://torinak.com/7segment.
      'segment7': require('./assets/fonts/7segment.ttf'),
    });
    this.setState({fontLoaded: true});
  }

  render() {
    if (!this.state.fontLoaded) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.display}>12:00</Text>
        </View>
        <View style={styles.row}>
          <Button
            title="Clock"
            onPress={() => this.props.navigation.navigate('ClockSettings', {grpcClient})}
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Counter"
            onPress={() => this.props.navigation.navigate('CounterSettings', {grpcClient})}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  display: {
    backgroundColor: 'black',
    color: '#F01',
    fontFamily: 'segment7',
    fontSize: 96,
    margin: 10,
    padding: 10,
    textShadowColor: '#C00',
    textShadowOffset: {width: 1, height: 1},
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 5,
    width: 200,
  },
});
