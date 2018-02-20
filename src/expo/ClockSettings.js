// @flow

import type GrpcClient from './GrpcClient';

import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

type Props = {
  navigation: {
    goBack(): void,
    state: {
      params: {
        grpcClient: GrpcClient,
      },
    },
  },
};
type State = {};

export default class ClockSettings extends React.Component<Props, State> {
  render() {
    return (
      <View>
        <Button title="Clock Mode" onPress={() => this.setMode()} />
      </View>
    );
  }

  async setMode() {
    const {navigation} = this.props;
    await navigation.state.params.grpcClient.useClockMode();
    navigation.goBack();
  }
}
