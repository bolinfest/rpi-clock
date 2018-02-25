// @flow
import {CLOCK_RED} from './colors';
import React from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  isEditable: boolean,
  displayText: string,
  onChangeText?: (text: string) => void,
};
type State = {};

export default class Display extends React.Component<Props, State> {
  _keyboardType: string;
  _myTextInput: ?TextInput;

  constructor(props: Props) {
    super(props);
    this._keyboardType = Platform.OS === 'ios' ? 'number-pad' : 'numeric';
  }

  render() {
    const {isEditable} = this.props;
    const onPress = isEditable ? () => this._focus() : null;
    return (
      <View>
        <Text style={styles.display} onPress={onPress}>
          {this.props.displayText}
        </Text>
        {isEditable ? (
          <TextInput
            keyboardType={this._keyboardType}
            style={styles.hiddenInput}
            ref={ref => {
              this._myTextInput = ref;
            }}
            onChangeText={text => this._onChangeText(text)}
          />
        ) : null}
      </View>
    );
  }

  _onChangeText(text: string) {
    const {onChangeText} = this.props;
    if (onChangeText == null) {
      return;
    }

    let displayText;
    let len = text.length;
    if (len === 0) {
      displayText = '0';
    } else if (len === 1) {
      displayText = ':0' + text;
    } else if (len === 2) {
      displayText = ':' + text;
    } else {
      const index = len - 2;
      displayText = text.substring(0, index) + ':' + text.substring(index);
    }

    onChangeText(displayText);
  }

  _focus() {
    if (this._myTextInput != null) {
      this._myTextInput.focus();
    }
  }
}

const styles = StyleSheet.create({
  display: {
    backgroundColor: 'black',
    color: CLOCK_RED,
    fontFamily: 'segment7',
    fontSize: 96,
    padding: 10,
    textAlign: 'right',
    textShadowColor: '#C00',
    textShadowOffset: {width: 1, height: 1},
  },
  hiddenInput: {
    height: 0,
    width: 0,
  },
});
