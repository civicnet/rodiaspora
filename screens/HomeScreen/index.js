import React from 'react';
import { createDrawerNavigator } from 'react-navigation';

import HomeScreen from './HomeScreen';
import Sidebar from '../Sidebar';

const HomeScreenRouter = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    // Chat: { screen: MainScreenNavigator },
    // Profile: { screen: Profile }
  },
  {
    contentComponent: props => <Sidebar {...props} />,
  },
);
export default HomeScreenRouter;
