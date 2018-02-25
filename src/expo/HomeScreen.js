// @flow

import type {Subscription} from 'rxjs/Observable';
import type {ConnectionStatus} from './ConnectionStatusView';

import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Constants, Font} from 'expo';
import ConnectionStatusView from './ConnectionStatusView';
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
  connection: ConnectionStatus,
  retryTimeout: ?number,
};

const {extra} = Constants.manifest;
const grpcClient = new GrpcClient(extra.webserverHostname, extra.webserverPort);

// TODO(mbolin): Use exponential backoff. Note this requires additional state.
const RETRY_TIMEOUT_MS = 10 * 1000;

export default class HomeScreen extends React.Component<Props, State> {
  state = {
    fontLoaded: false,
    displaySubscription: null,
    displayText: '',
    connection: 'CONNECTING',
    retryTimeout: null,
  };

  async componentDidMount() {
    await Font.loadAsync({
      // Font is from http://torinak.com/7segment.
      segment7: require('./assets/fonts/7segment.ttf'),
    });
    this.setState({
      fontLoaded: true,
    });
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe(/*unmounting*/ true);
  }

  render() {
    const {fontLoaded, displayText, connection} = this.state;
    if (!fontLoaded) {
      return null;
    }

    return (
      <View style={styles.container}>
        <ConnectionStatusView status={connection} />
        <View style={styles.display}>
          <Display isEditable={false} displayText={displayText} />
        </View>
        <View style={styles.row}>
          <Button
            title="Clock"
            onPress={() =>
              this.props.navigation.navigate('ClockSettings', {grpcClient})
            }
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Set Timer"
            onPress={() =>
              this.props.navigation.navigate('TimerSettings', {grpcClient})
            }
          />
        </View>
      </View>
    );
  }

  _subscribe() {
    this.setState({
      connection: 'CONNECTING',
    });
    const displaySubscription = grpcClient.observeDisplay().subscribe(
      value => {
        this.setState({
          connection: 'CONNECTED',
          displayText: formatDisplay(value),
        });
      },
      err => {
        console.info('displaySubscription observable error:', err);
        this._unsubscribe();
      },
      () => {
        console.info('displaySubscription observable completed');
        this._unsubscribe();
      }
    );
    this.setState({
      displaySubscription,
    });
  }

  _unsubscribe(unmounting?: boolean) {
    const {displaySubscription} = this.state;
    if (displaySubscription == null) {
      console.info('Suspicious: unsubscribing without subscription.');
      return;
    }

    displaySubscription.unsubscribe();
    if (unmounting) {
      if (this.state.retryTimeout != null) {
        clearTimeout(this.state.retryTimeout);
      }
    } else {
      const retryTimeout = setTimeout(
        () => this._subscribe(),
        RETRY_TIMEOUT_MS
      );
      this.setState({
        displaySubscription: null,
        connection: 'WAITING_TO_RETRY',
        retryTimeout,
      });
    }
  }
}

function formatDisplay(display): string {
  const {digits, colon} = display;
  const chars = ' '.repeat(4 - digits.length) + digits;
  // TODO(mbolin): Honor `colon` when displaying.
  return chars.substring(0, 2) + ':' + chars.substring(2, 4);
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
