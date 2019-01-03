import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
} from 'react-native';

import {
  MapView,
} from 'expo';
import polyline from '@mapbox/polyline';

import Uber from './styles/Uber.json';
import MapPinOutline from '../../assets/images/vote-s-yellow-alt.png';
import MapPinSelected from '../../assets/images/vote-s-yellow.png';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const HEADER_HEIGHT = 56;

export default class Map extends Component {
  componentDidUpdate(prevProps) {
    const {
      selected,
    } = this.props;
    if (!prevProps || !this.map) {
      return;
    }

    this.map.animateToRegion(
      {
        latitude: selected.latitude,
        longitude: selected.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    );
  }

  _onMarkerPress(ev, item) {
    const {
      onSelectedItem,
    } = this.props;

    if (onSelectedItem) {
      onSelectedItem(item);
    }
  }

  render() {
    const {
      markers,
      center,
      selected,
      showDirections,
      onPress,
    } = this.props;

    if (!markers || !center) {
      return null;
    }

    let poly = null;
    if (showDirections && showDirections.routes.length) {
      // eslint-disable-next-line prefer-destructuring
      const geometry = showDirections.routes[0].geometry;

      poly = (
        <MapView.Polyline
          coordinates={polyline.decode(geometry).map(coords => ({
            latitude: coords[0],
            longitude: coords[1],
          }))}
          strokeColor="#000"
          strokeColors={[
            '#7F0000',
            '#00000000',
            '#B24112',
            '#E5845C',
            '#238C23',
            '#7F0000',
          ]}
          strokeWidth={4}
        />
      );
    }


    return (
      <MapView
        style={{ flex: 1, width, height: height - HEADER_HEIGHT }}
        customMapStyle={Uber}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onPress={onPress}
        ref={(el) => { this.map = el; }}
        showsUserLocation
      >
        {markers.map((marker) => {
          const image = selected && marker.id === selected.id
            ? MapPinSelected
            : MapPinOutline;

          return (
            <MapView.Marker
              key={Math.random()}
              onPress={e => this._onMarkerPress(e.nativeEvent, marker)}
              coordinate={{ ...marker }}
              image={image}
            >
            </MapView.Marker>
          );
        })}
        {poly}
      </MapView>
    );
  }
}

Map.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  markers: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  center: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selected: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  showDirections: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  onSelectedItem: PropTypes.func.isRequired,
};

Map.defaultProps = {
  selected: null,
  showDirections: null,
};
