// @flow

// $FlowFixMe: Unclear why this is in the default ignore list.
import {StackNavigator} from 'react-navigation';
import ClockSettings from './ClockSettings';
import CounterSettings from './CounterSettings';
import HomeScreen from './HomeScreen';

export default StackNavigator(
  {
    ClockSettings: {
      screen: ClockSettings,
    },
    CounterSettings: {
      screen: CounterSettings,
    },
    Home: {
      screen: HomeScreen,
    },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      title: 'Clock',
      headerStyle: {
        backgroundColor: 'rgb(0, 102, 0)',
      },
      headerTitleStyle: {
        color: 'white',
      },
    },
  },
);
