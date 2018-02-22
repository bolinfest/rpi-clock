// @flow

import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

type Props = {
  isEditable: boolean,
  initialDisplayText: string,
};
type State = {
  displayText: string,
};

export default class Display extends React.Component<Props, State> {
  _myTextInput: ?TextInput;

  componentWillMount() {
    this._setDefaultState(this.props);
  }

  // We leverage componentWillReceiveProps() because we have state that is a
  // function of props:
  // https://discuss.reactjs.org/t/how-to-pass-in-initial-value-to-form-fields/869/15.
  componentWillReceiveProps(nextProps: Props) {
    this._setDefaultState(nextProps);
  }

  _setDefaultState(props: Props) {
    this.setState({displayText: props.initialDisplayText});
  }

  render() {
    const {isEditable} = this.props;
    const onPress = isEditable ? () => this._focus() : null;
    return (
      <View>
        <Text style={styles.display} onPress={onPress}>
          {this.state.displayText}
        </Text>
        {isEditable ? (
          <TextInput
            keyboardType="numeric"
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
    this.setState({displayText});
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
    color: '#F01',
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
