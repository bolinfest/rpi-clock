// @flow

import type GrpcClient from './GrpcClient';

import Display from './Display';
import React from 'react';
import {APP_GREEN} from './colors';
import {
  ActivityIndicator,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DoneBar from './DoneBar';

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
  presets: Array<Array<string>>,
  waiting: boolean,
};

export default class TimerSettings extends React.Component<Props, State> {
  _setDisplayTextFn: (text: string) => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      displayText: '5:00',
      presets: [
        ['1:00', '2:00', '3:00'],
        ['5:00', '10:00', '15:00'],
        ['30:00', '45:00', '60:00'],
      ],
      waiting: false,
    };
    this._setDisplayTextFn = this._setDisplayText.bind(this);
  }

  render() {
    const {displayText, presets, waiting} = this.state;

    const numColumns = presets.length > 0 ? presets[0].length : 0;
    const presetButtons = presets.map((data, row) => {
      const children = data.map((preset, column) => {
        return (
          <TimerButton
            title={preset}
            column={column}
            numColumns={numColumns}
            setDisplayText={this._setDisplayTextFn}
            key={`preset:${row}/${column}`}
          />
        );
      });
      return (
        <View key={`preset:${row}`} style={styles.timerButtons}>
          {children}
        </View>
      );
    });

    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.body}>
          <View>
            <View style={styles.hint1Text}>
              <Text>Tap to enter a custom time:</Text>
            </View>
            <View>
              <Display
                isEditable={true}
                displayText={displayText}
                onChangeText={this._setDisplayTextFn}
              />
            </View>
            <View style={styles.hint2Text}>
              <Text>Or choose a preset time:</Text>
            </View>
            {presetButtons}
          </View>
          <View>
            <View>
              <Button
                title="Start Timer"
                onPress={() => this.startTimer()}
                color={APP_GREEN}
              />
            </View>
            <ActivityIndicator animating={waiting} />
          </View>
        </View>
        <DoneBar keyboardType="number-pad" />
      </KeyboardAvoidingView>
    );
  }

  async startTimer() {
    const seconds = displayTextToSeconds(this.state.displayText);
    const {navigation} = this.props;
    this.setState({waiting: true});
    await navigation.state.params.grpcClient.startTimer(seconds);
    this.setState({waiting: false});
    navigation.goBack();
  }

  _setDisplayText(displayText: string) {
    this.setState({displayText});
  }
}

type ButtonProps = {
  title: string,
  column: number,
  numColumns: number,
  setDisplayText: (text: string) => void,
};
type ButtonState = {};

class TimerButton extends React.Component<ButtonProps, ButtonState> {
  render() {
    const {title, column, numColumns} = this.props;
    const extraStyles = {
      marginLeft: column !== 0 ? 5 : 0,
      marginRight: column !== numColumns - 1 ? 5 : 0,
    };
    return (
      <View style={[styles.timerButton, extraStyles]}>
        <Button
          title={this.props.title}
          onPress={() => this.props.setDisplayText(this.props.title)}
        />
      </View>
    );
  }
}

function displayTextToSeconds(text: string): number {
  const parts = text.split(':');
  let minutes;
  let seconds;
  if (parts.length === 1) {
    minutes = NaN;
    seconds = parseInt(parts[0], 10);
  } else {
    minutes = parseInt(parts[0], 10);
    seconds = parseInt(parts[1], 10);
  }

  if (isNaN(minutes)) {
    minutes = 0;
  }
  if (isNaN(seconds)) {
    seconds = 0;
  }
  return 60 * minutes + seconds;
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    margin: 10,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  hint1Text: {
    marginBottom: 5,
  },
  hint2Text: {
    marginBottom: 5,
    marginTop: 5,
  },
  timerButton: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
