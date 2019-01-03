import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import ImageOverlay from 'react-native-image-overlay';

import {
  Text,
  Button,
  Spinner,
} from 'native-base';

import Flickr from '../../lib/Flickr';

export default class Welcome extends Component {
  state = {
    photoURL: null,
  }

  async componentDidMount() {
    const { photoURL } = this.state;

    if (photoURL) {
      return;
    }

    const { coords } = this.props;
    if (coords) {
      this._getPhotosAsync(coords);
    }
  }

  async _getPhotosAsync(coords) {
    this.flickr = new Flickr(coords);
    const photoURL = await this.flickr.getRandomPhoto('welcome');
    this.setState({ photoURL });
  }

  render() {
    const { photoURL } = this.state;
    const { geocode } = this.props;

    if (!photoURL) {
      return <Spinner />;
    }

    return (
      <ImageOverlay
        source={{ uri: photoURL }}
        height={120}
        containerStyle={{ justifyContent: 'flex-start', alignItems: 'flex-start', padding: 8 }}
        contentPosition="top"
      >
        <View>
          <Text style={{ color: '#fff', flexGrow: 1 }}>
            {`${geocode[0].city}, ${geocode[0].country}`}
          </Text>
          <Button bordered light style={{ alignSelf: 'flex-end' }}>
            <Text>Alege altă locație</Text>
          </Button>
        </View>
      </ImageOverlay>
    );
  }
}

Welcome.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  geocode: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  coords: PropTypes.object.isRequired,
};
