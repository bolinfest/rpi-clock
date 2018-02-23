// @flow

// $FlowFixMe: Unclear why this is in the default ignore list.
import {StackNavigator} from 'react-navigation';
import ClockSettings from './ClockSettings';
import TimerSettings from './TimerSettings';
import HomeScreen from './HomeScreen';
import {APP_GREEN} from './colors';

export default StackNavigator(
  {
    ClockSettings: {
      screen: ClockSettings,
    },
    TimerSettings: {
      screen: TimerSettings,
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
        backgroundColor: APP_GREEN,
      },
      headerTitleStyle: {
        color: 'white',
      },
    },
  },
);
