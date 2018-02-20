// @flow

import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import GrpcClient from './GrpcClient';

type Props = {
  navigation: {
    navigate(target: string, params: mixed): void,
  },
};
type State = {};

// TODO(mbolin): Read values from config.toml.
const HOSTNAME = 'raspberrypi.local';
const PORT = 8081;
const grpcClient = new GrpcClient(HOSTNAME, PORT);

export default class HomeScreen extends React.Component<Props, State> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>

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
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 5,
    width: 200,
  },
});
