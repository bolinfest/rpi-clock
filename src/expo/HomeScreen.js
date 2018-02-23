// @flow

import type {Subscription} from 'rxjs/Observable';

import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Font} from 'expo';
import Display from './Display';
import GrpcClient from './GrpcClient';

type Props = {
  navigation: {
    navigate(target: string, params: mixed): void,
  },
};
type State = {
  fontLoaded: boolean,
  displaySubscription: ?Subscription<mixed>,
  displayText: string,
};

// TODO(mbolin): Read values from config.toml.
const HOSTNAME = 'raspberrypi.local';
// const HOSTNAME = '192.168.1.55';
const PORT = 8081;
const grpcClient = new GrpcClient(HOSTNAME, PORT);

export default class HomeScreen extends React.Component<Props, State> {
  state = {
    fontLoaded: false,
    displaySubscription: null,
    displayText: '',
  };

  async componentDidMount() {
    await Font.loadAsync({
      // Font is from http://torinak.com/7segment.
      'segment7': require('./assets/fonts/7segment.ttf'),
    });
    const displaySubscription = grpcClient.observeDisplay().subscribe(
      (value) => this.setState({displayText: formatDisplay(value)}),
      (err) => this._unsubscribe(),
      () => this._unsubscribe(),
    );
    this.setState({fontLoaded: true, displaySubscription});
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _unsubscribe() {
    if (this.state.displaySubscription != null) {
      this.state.displaySubscription.unsubscribe();
      this.setState({displaySubscription: null});
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.display}>
          <Display isEditable={false} displayText={this.state.displayText} />
        </View>
        <View style={styles.row}>
          <Button
            title="Clock"
            onPress={() => this.props.navigation.navigate('ClockSettings', {grpcClient})}
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Set Timer"
            onPress={() => this.props.navigation.navigate('TimerSettings', {grpcClient})}
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
  display: {
    margin: 10,
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 5,
    width: 200,
  },
});

function formatDisplay(display): string {
  const {digits, colon} = display;
  const chars = ' '.repeat(4 - digits.length) + digits;
  // TODO(mbolin): Honor `colon` when displaying.
  return chars.substring(0, 2) + ':' + chars.substring(2, 4);
}
