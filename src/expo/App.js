import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>Heading</Text>
        </View>
        <View style={styles.row}>
          <Button
            title="Clock"
            onPress={useClockMode}
          />
        </View>
        <View style={styles.row}>
          <Button
            title="Counter"
            onPress={useCounter}
          />
        </View>
      </View>
    );
  }
}

// TODO(mbolin): Read values from config.toml.
const HOSTNAME = 'raspberrypi.local';
const PORT = 8081;
const HOST = `${HOSTNAME}:${PORT}`;

async function useClockMode() {
  await fetch(`http://${HOST}/clock`, {
    method: 'POST',
    headers: {
      'X-XSRF': '1',
    },
  });
}

async function useCounter() {
  await fetch(`http://${HOST}/count_up`, {
    method: 'POST',
    headers: {
      'X-XSRF': '1',
    },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});
