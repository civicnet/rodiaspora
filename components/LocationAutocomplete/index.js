import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Item,
  Input,
  Icon,
  Text,
} from 'native-base';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';

import Geocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = Geocoding({
  accessToken: 'pk.eyJ1IjoiY2xhdWRpdWMiLCJhIjoiY2lrZXV5dzNiMDA3NnRvbHlwMWc3ZHp4YiJ9.8DeWMyPr2T8jRDeShSebTQ',
});

const styles = StyleSheet.create({
  container: {
  },
  item: {
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    paddingRight: 16,
  },
  myLocationIcon: {
    color: '#37474F',
    marginLeft: 8,
  },
  autocompleteDropwdown: {
    padding: 8,
    width: '100%',
    backgroundColor: '#fff',
    marginLeft: 2,
    paddingBottom: 0,
  },
  autocompleteEmpty: {
    padding: 0,
  },
  autocompleteItem: {
    padding: 4,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  autocompleteFirstItem: {
    padding: 4,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 0,
  },
});

export default class LocationAutocomplete extends Component {
  static _convertQueryForMapbox = (query) => {
    // Remove punctuation, and then extra spaces
    const cleanQuery = query
      // eslint-disable-next-line no-useless-escape
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ');

    // URL escaped, UTF-8
    const escapedQuery = unescape(encodeURIComponent(cleanQuery));
    const countWords = cleanQuery.split(' ').length;
    if (countWords < 20 && escapedQuery < 256) {
      return escapedQuery;
    }

    return escapedQuery.substring(0, 256);
  }

  timerID = null;

  input = null;

  state = {
    suggestions: null,
    autoLocation: null,
    hidden: false,
  }

  hideAutocomplete = () => {
    this.setState({
      hidden: true,
    });
  }

  _onResetLocation = () => {
    this.setState({
      autoLocation: this._geocodeToString(),
    });
  }

  _clearAutoLocation = () => {
    this.setState({
      autoLocation: null,
      hidden: false,
    });
  }

  _getSuggestions = async (text) => {
    const response = await geocodingClient
      .forwardGeocode({
        query: LocationAutocomplete._convertQueryForMapbox(text),
        limit: 5,
        types: ['place'],
      })
      .send();
    const suggestions = response.body;

    this.setState({
      suggestions,
    });
  };

  _onTextChange = (text) => {
    if (text.length === 0) {
      if (this.timerID) {
        clearTimeout(this.timerID);
      }

      this.setState({
        suggestions: null,
      });
    }

    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    } else {
      this.timerID = setTimeout(async () => {
        await this._getSuggestions(text);
      }, 200);
    }
  };

  _selectSuggestion = (suggestion) => {
    const {
      overrideLocation,
    } = this.props;

    this.setState({
      autoLocation: suggestion.place_name,
      suggestions: null,
    });
    Keyboard.dismiss();

    const newCoords = {
      coords: {
        latitude: suggestion.center[1],
        longitude: suggestion.center[0],
      },
    };

    let country = null;
    const city = suggestion.text;
    suggestion.context.forEach((value) => {
      if (value.id.substr(0, 7) === 'country') {
        country = value.text;
      }
    });

    overrideLocation(
      newCoords,
      {
        city,
        country,
        coords: newCoords,
      },
    );
  }

  _geocodeToString = () => {
    const { geocode } = this.props;

    return (geocode.city && geocode.country)
      ? `${geocode.city}, ${geocode.country}`
      : geocode.placeholder;
  };

  render() {
    const {
      autoLocation,
      suggestions,
      hidden,
    } = this.state;

    const {
      style,
    } = this.props;

    let list = null;
    if (suggestions && suggestions.features.length && !hidden) {
      list = (
        <FlatList
          keyboardShouldPersistTaps="always"
          data={suggestions.features}
          keyExtractor={suggestion => `key-${suggestion.place_name}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={index !== 0 ? styles.autocompleteItem : styles.autocompleteFirstItem}
              onPress={() => this._selectSuggestion(item)}
            >
              <Text>{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    return (
      <View style={[styles.container, style]}>
        <Item style={styles.item} elevation={3}>
          <Icon
            active
            name="my-location"
            type="MaterialIcons"
            style={styles.myLocationIcon}
            onPress={this._onResetLocation}
          />
          <Input
            style={styles.input}
            onChangeText={this._onTextChange}
            placeholder={this._geocodeToString()}
            ref={(ref) => { this.input = ref; }}
            value={autoLocation}
            onFocus={this._clearAutoLocation}
          />
        </Item>
        <View
          elevation={1}
          style={!list ? styles.autocompleteEmpty : styles.autocompleteDropwdown}
        >
          {list}
        </View>
      </View>
    );
  }
}

LocationAutocomplete.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  geocode: PropTypes.object.isRequired,
  overrideLocation: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

LocationAutocomplete.defaultProps = {
  style: {},
};
