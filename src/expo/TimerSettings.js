// @flow

import type GrpcClient from './GrpcClient';

import Display from './Display';
import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import invariant from 'invariant';

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

type State = {
  displayText: string,
};

export default class TimerSettings extends React.Component<Props, State> {
  _onChangeTextFn: (text: string) => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      displayText: '5:00',
    };
    this._onChangeTextFn = this._onChangeText.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.hintText}>
          <Text>Tap to enter a custom time:</Text>
        </View>
        <View>
          <Display
            isEditable={true}
            displayText={this.state.displayText}
            onChangeText={this._onChangeTextFn}
          />
        </View>
        <View>
          <Button title="Start Timer" onPress={() => this.startTimer()} />
        </View>
      </View>
    );
  }

  async startTimer() {
    const seconds = displayTextToSeconds(this.state.displayText);
    const {navigation} = this.props;
    await navigation.state.params.grpcClient.startTimer(seconds);
    navigation.goBack();
  }

  _onChangeText(displayText: string) {
    this.setState({displayText});
  }
}

function displayTextToSeconds(text: string): number {
  const parts = text.split(':');
  if (parts.length === 1) {
    parts.unshift('');
  }
  invariant(parts.length === 2, 'Unexpected length');

  let minutes = parseInt(parts[0], 10);
  let seconds = parseInt(parts[1], 10);
  if (isNaN(minutes)) {
    minutes = 0;
  }
  if (isNaN(seconds)) {
    seconds = 0;
  }
  return 60 * minutes + seconds;
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  hintText: {
    marginBottom: 5,
  },
});
