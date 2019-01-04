import React from 'react';

import {
  AppLoading,
  Font,
  Icon,
} from 'expo';

import { Root } from 'native-base';

import HomeScreen from './screens/HomeScreen';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  _loadResourcesAsync = async () => Promise.all([
    Font.loadAsync({
      ...Icon.Ionicons.font,
      /* eslint-disable */
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      RobotoSlab: require('./assets/fonts/RobotoSlab-Regular.ttf'),
      RobotoSlab_light: require('./assets/fonts/RobotoSlab-Light.ttf'),
      RobotoSlab_bold: require('./assets/fonts/RobotoSlab-Bold.ttf'),
      RobotoSlab_thin: require('./assets/fonts/RobotoSlab-Thin.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      /* eslint-enable */
    }),
  ]);

  _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    // eslint-disable-next-line no-console
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    const {
      isLoadingComplete,
      skipLoadingScreen,
    } = this.state;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    return (
      <Root>
        <HomeScreen />
      </Root>
    );
  }
}
