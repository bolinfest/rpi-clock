import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>For now, your only options are to toggle between clock and counter</Text>
        <Button
          title="Clock"
          onPress={useClockMode}
        />
        <Button
          title="Counter"
          onPress={useCounter}
        />
      </View>
    );
  }
}

async function useClockMode() {
  await fetch('http://raspberrypi.local:8081/clock', {
    method: 'POST',
    headers: {
      'X-XSRF': '1',
    },
  });
}

async function useCounter() {
  await fetch('http://raspberrypi.local:8081/count_up', {
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
});
