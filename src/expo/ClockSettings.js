// @flow

import type GrpcClient from './GrpcClient';

import React from 'react';
import {APP_GREEN} from './colors';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

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
  // TODO(mbolin): This should be a prop.
  is24Hour: boolean,
  waiting: boolean,
};

export default class ClockSettings extends React.Component<Props, State> {
  state = {
    is24Hour: false,
    waiting: false,
  };

  render() {
    const {is24Hour, waiting} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.settings}>
            <Text>Use 24-hour time:</Text>
            <Switch
              value={is24Hour}
              onValueChange={value => this.setState({is24Hour: value})}
            />
          </View>
          <View>
            <View>
              <Button
                title="Display Time"
                onPress={() => this.setMode()}
                color={APP_GREEN}
              />
              <ActivityIndicator animating={waiting} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  async setMode() {
    const {navigation} = this.props;
    await navigation.state.params.grpcClient.useClockMode(this.state.is24Hour);
    navigation.goBack();
  }
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
  settings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
