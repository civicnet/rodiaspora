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
});

export default class MapSearch extends Component {
  hideAutocomplete = () => {
    this.autocomplete.hideAutocomplete();
  }

  render() {
    const {
      geocode,
      onOpenDrawer,
    } = this.props;

    return (
      <View style={styles.container}>
        <LocationAutocomplete geocode={geocode} ref={(ref) => { this.autocomplete = ref; }} />
        <Button transparent dark style={styles.button} onPress={onOpenDrawer}>
          <Icon name="bars" type="FontAwesome" style={styles.icon} />
        </Button>
      </View>
    );
  }
}

MapSearch.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  geocode: PropTypes.object.isRequired,
  onOpenDrawer: PropTypes.func.isRequired,
};
