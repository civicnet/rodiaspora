import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';

import {
  Button,
  Icon,
} from 'native-base';

import LocationAutocomplete from '../LocationAutocomplete';
import DistanceSlider from '../DistanceSlider';
import DefaultCoords from '../../constants/DefaultCoords';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    zIndex: 100,
    flex: 1,
    width,
    padding: 8,
    flexDirection: 'row',
  },
  button: {
    width: 60,
    flexShrink: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    color: '#37474F',
  },
  input: {
    flexGrow: 1,
  },
});

export default class MapSearch extends Component {
  state = {
    showFilter: false,
  };

  hideAutocomplete = () => {
    if (this.autocomplete) {
      this.autocomplete.hideAutocomplete();
    }
  }

  _toggleFilter = () => {
    const { showFilter } = this.state;

    this.setState({
      showFilter: !showFilter,
    });
  }

  render() {
    const {
      geocode,
      onOpenDrawer,
      overrideLocation,
    } = this.props;

    const {
      showFilter,
    } = this.state;

    const input = showFilter
      ? (
        <DistanceSlider
          minDistance={100}
          maxDistance={2000}
          step={100}
          value={500}
        />
      )
      : (
        <LocationAutocomplete
          style={styles.input}
          geocode={geocode}
          ref={(ref) => { this.autocomplete = ref; }}
          overrideLocation={overrideLocation}
        />
      );

    return (
      <View style={styles.container}>
        {input}
        <Button transparent dark style={styles.button} onPress={this._toggleFilter}>
          <Icon name={showFilter ? 'search' : 'filter'} type="FontAwesome" style={styles.icon} />
        </Button>
        <Button transparent dark style={styles.button} onPress={onOpenDrawer}>
          <Icon name="bars" type="FontAwesome" style={styles.icon} />
        </Button>
      </View>
    );
  }
}

MapSearch.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  geocode: PropTypes.object,
  onOpenDrawer: PropTypes.func.isRequired,
  overrideLocation: PropTypes.func.isRequired,
};

MapSearch.defaultProps = {
  geocode: {
    city: null,
    country: null,
    placeholder: 'Unde vrei să votezi?',
    coords: { ...DefaultCoords },
  },
};
