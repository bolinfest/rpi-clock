// @flow

import type GrpcClient from './GrpcClient';

import Display from './Display';
import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

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

export default class CounterSettings extends React.Component<Props, State> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.hintText}>
          <Text>Tap to enter a custom time:</Text>
        </View>
        <View>
          <Display isEditable={true} initialDisplayText="5:00" />
        </View>
        <View>
          <Button title="Start Counter" onPress={() => this.setMode()} />
        </View>
      </View>
    );
  }

  async setMode() {
    const {navigation} = this.props;
    await navigation.state.params.grpcClient.useCounter();
    navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  hintText: {
    marginBottom: 5,
  },
});
