import React from 'react';

import { AppLoading } from 'expo';

import { Asset } from 'expo-asset';
import * as Icon from '@expo/vector-icons';
import * as Font from 'expo-font';

import { Root } from 'native-base';

import HomeScreen from './screens/HomeScreen';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  _loadResourcesAsync = async () => {
    const images = [
      require('./assets/images/gears.png'),
      require('./assets/images/icon.png'),
      require('./assets/images/logo-civictech-small.png'),
      require('./assets/images/logo-mae.png'),
      require('./assets/images/not-found.png'),
      require('./assets/images/passport.png'),
      require('./assets/images/placeholder.png'),
      require('./assets/images/tower.png'),
      require('./assets/images/user-location-pin.png'),
      require('./assets/images/vote-o-black.png'),
      require('./assets/images/vote-o-green.png'),
      require('./assets/images/vote-s-yellow.png'),
      require('./assets/images/vote-s-yellow-alt.png'),
      require('./assets/images/warning.png'),
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all([
      ...cacheImages,
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
  }

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
