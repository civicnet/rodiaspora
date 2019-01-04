import React from 'react';
import { createDrawerNavigator } from 'react-navigation';

import HomeScreen from './HomeScreen';
import AboutScreen from '../AboutScreen';
import NewsScreen from '../NewsScreen';

import Sidebar from '../Sidebar';

const HomeScreenRouter = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    About: {
      screen: AboutScreen,
    },
    News: {
      screen: NewsScreen,
    },
  },
  {
    contentComponent: props => <Sidebar {...props} />,
    drawerPosition: 'right',
  },
);
export default HomeScreenRouter;
