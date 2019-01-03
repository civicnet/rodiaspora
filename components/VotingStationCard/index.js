import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
} from 'react-native';

import ImageOverlay from 'react-native-image-overlay';

import {
  Card,
  CardItem,
  Text,
  Button,
  Icon,
  Right,
} from 'native-base';

import Flickr from '../../lib/Flickr';

const styles = StyleSheet.create({
  location: {
    color: '#fff',
    fontSize: 14,
  },
});

export default class VotingStationCard extends Component {
  state = {
    photoURL: null,
  }

  async componentDidMount() {
    const { coords } = this.props;
    if (coords) {
      this._getPhotosAsync(coords);
    }
  }

  async _getPhotosAsync(coords) {
    this.flickr = new Flickr(coords);
    const photoURL = await this.flickr.getRandomPhoto('station');
    this.setState({
      photoURL,
    });
  }

  render() {
    const {
      highlighted,
      height,
      coords,
      onShowRoute,
      address,
      name,
      country,
      distance,
    } = this.props;

    const {
      photoURL,
    } = this.state;

    let image = null;

    if (photoURL) {
      image = (
        <ImageOverlay
          source={{ uri: photoURL }}
          height={height}
          containerStyle={{ width: '100%', flex: 1 }}
          title={address}
          titleStyle={styles.location}
          contentPosition="bottom"
        />
      );
    }

    return (
      <Card style={{ opacity: highlighted ? 1 : 0.5 }}>
        <CardItem header>
          <View style={{ flexGrow: 1 }}>
            <Text>{name}</Text>
            <Text note>{`${country}, approx. ${distance} km`}</Text>
          </View>
          <Right style={{ flexShrink: 1 }}>
            <Button iconLeft transparent primary onPress={() => onShowRoute(coords)}>
              <Icon name="ellipsis-v" type="FontAwesome" />
            </Button>
          </Right>
        </CardItem>
        <CardItem cardBody style={{ height }}>
          { image }
        </CardItem>
      </Card>
    );
  }
}

VotingStationCard.propTypes = {
  highlighted: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  coords: PropTypes.object.isRequired,
  onShowRoute: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  distance: PropTypes.number.isRequired,
};
