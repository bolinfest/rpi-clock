// @flow

import {CLOCK_RED} from './colors';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export type ConnectionStatus =
  | 'CONNECTED'
  | 'CONNECTING'
  | 'WAITING_TO_RETRY';

export default class ConnectionStatusView extends React.Component<
  {
    status: ConnectionStatus,
  },
  {}
> {
  render() {
    const {status} = this.props;
    let text = null;
    if (status === 'WAITING_TO_RETRY') {
      // TODO(mbolin): Display how many seconds until next retry.
      // TODO(mbolin): Allow user to tap to retry now.
      text = 'Not connected to server. Waiting to retry...';
    } else if (status === 'CONNECTING') {
      text = 'Trying to reconnect...';
    } else {
      return null;
    }

    return (
      <View style={styles.view}>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: CLOCK_RED,
    position: 'absolute',
    left: 0,
    padding: 10,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  text: {
    color: 'white',
  },
});
