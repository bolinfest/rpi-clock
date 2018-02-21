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
      gestureResponseDistance: {
        // Make it easier to swipe right/left.
        horizontal: 125,
        vertical: 135,
      },
      headerStyle: {
        backgroundColor: 'rgb(0, 102, 0)',
      },
      headerTitleStyle: {
        color: 'white',
      },
    },
  },
);
