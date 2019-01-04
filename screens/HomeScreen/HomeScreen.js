import React from 'react';
import PropTypes from 'prop-types';

import {
  Platform,
  View,
  StatusBar,
  AsyncStorage,
  Dimensions,
  StyleSheet,
} from 'react-native';

import {
  Constants,
  Location,
  Permissions,
} from 'expo';

import {
  Container,
  Content,
  Spinner,
} from 'native-base';

import Directions from '@mapbox/mapbox-sdk/services/directions';
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding';

import { sha256 } from 'js-sha256';
import { oneLineTrim } from 'common-tags';

import Map from '../../components/Map';
import MapSearch from '../../components/MapSearch';
import VotingStationList from '../../components/VotingStationList';
import LocationErrorCard from '../../components/LocationErrorCard';
import Geo from '../../lib/Geo';

import * as MarkerLocations from '../../assets/data/markers-data.json';

const directionsClient = Directions({
  accessToken: 'pk.eyJ1IjoiY2xhdWRpdWMiLCJhIjoiY2lrZXV5dzNiMDA3NnRvbHlwMWc3ZHp4YiJ9.8DeWMyPr2T8jRDeShSebTQ',
});
const geocodingClient = Geocoding({
  accessToken: 'pk.eyJ1IjoiY2xhdWRpdWMiLCJhIjoiY2lrZXV5dzNiMDA3NnRvbHlwMWc3ZHp4YiJ9.8DeWMyPr2T8jRDeShSebTQ',
});

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    bottom: 20,
    left: (width / 2) - 18,
  },
});

export default class HomeScreen extends React.Component {
  static _calculateOrderedMarkers(markers, location) {
    const parsedMarkers = markers.map((marker) => {
      const distance = Geo.harversine(
        marker,
        {
          ...location.coords,
        },
      );

      return {
        ...marker,
        distance,
      };
    });

    return parsedMarkers
      .sort((marker1, marker2) => marker1.distance - marker2.distance)
      .map((marker, idx) => ({
        index: idx,
        ...marker,
      }));
  }

  static _getRouteCacheKey(markerCoords, locationCoords) {
    const hash = sha256(oneLineTrim`
      ${markerCoords.latitude}
      ${markerCoords.latitude}
      ${locationCoords.latitude}
      ${locationCoords.longitude}
    `);

    return `@ROUTES:${hash}`;
  }

  state = {
    errorMessage: null,
    location: null,
    locationGeocode: null,
    markers: [],
    selectedMarker: null,
    currentDirections: null,
    isCardListMinimized: false,
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }

    const markers = Object.keys(MarkerLocations).map((key) => {
      const obj = MarkerLocations[key];
      if (!obj || !obj.coords) {
        return null;
      }

      return {
        name: obj.name,
        address: obj.address,
        country: obj.country,
        latitude: Number(obj.coords.lat),
        longitude: Number(obj.coords.lng),
        id: sha256(`${obj.name}:${obj.address}`),
      };
    });

    this.setState({ markers: markers.filter(coords => coords != null) });
  }

  _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Nu am primit permisiunea de a accesa locația',
      });
      return;
    }

    let location = null;
    try {
      location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
    } catch (e) {
      this.setState({
        errorMessage: 'Te rugăm pornește serviciile de localizare',
      });
    }

    if (!location) {
      return;
    }

    const geocodeResponse = await geocodingClient.reverseGeocode({
      query: [
        location.coords.longitude,
        location.coords.latitude,
      ],
      limit: 1,
    }).send();

    const locationGeocode = {
      city: geocodeResponse.body.features[0].context[0].text,
      region: geocodeResponse.body.features[0].context[1].text,
      country: geocodeResponse.body.features[0].context[2].text,
      address: geocodeResponse.body.features[0].properties.address,
      name: geocodeResponse.body.features[0].place_name,
    };

    this.setState({ location, locationGeocode });
  };

  _onSelectedItem = (item) => {
    this.setState({
      selectedMarker: item,
      isCardListMinimized: false,
    });
  }

  _onMapPress = () => {
    this.setState({
      isCardListMinimized: true,
    });

    this.mapSearch.hideAutocomplete();
  }

  _onShowRoute = async (marker) => {
    const { location } = this.state;
    const cacheKey = HomeScreen._getRouteCacheKey(
      marker,
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    );

    const stored = await AsyncStorage.getItem(cacheKey);

    if (stored) {
      this.setState({
        currentDirections: JSON.parse(stored),
        isCardListMinimized: false,
      });
      return;
    }

    const directions = await directionsClient.getDirections({
      waypoints: [
        {
          coordinates: [
            marker.longitude,
            marker.latitude,
          ],
        },
        {
          coordinates: [
            location.coords.longitude,
            location.coords.latitude,
          ],
        },
      ],
    }).send();

    await AsyncStorage.setItem(cacheKey, JSON.stringify(directions.body));
    this.setState({
      currentDirections: directions.body,
      isCardListMinimized: false,
    });
  }

  _forceShowCardList = () => this.setState({ isCardListMinimized: false });

  _openDrawer = () => {
    const {
      navigation,
    } = this.props;

    navigation.toggleDrawer();
  }

  render() {
    const {
      errorMessage,
      location,
      locationGeocode,
      markers,
      selectedMarker,
      currentDirections,
      isCardListMinimized,
    } = this.state;

    const defaultCoords = {
      latitude: 48.0994207,
      longitude: 4.1512819,
    };

    let topMarkers = [];
    if (location) {
      topMarkers = HomeScreen._calculateOrderedMarkers(
        markers,
        location,
      ).filter(marker => marker.distance <= 1000 * 500);
    }

    let stationList = null;

    if (errorMessage) {
      stationList = <LocationErrorCard />;
    }

    if (!errorMessage && (!location || !topMarkers.length)) {
      stationList = <Spinner style={styles.spinner} color="#666" />;
    }

    if (stationList === null) {
      stationList = (
        <VotingStationList
          markers={topMarkers}
          selected={selectedMarker}
          onSelectedItem={this._onSelectedItem}
          onShowRoute={this._onShowRoute}
          showDirections={currentDirections}
          hidden={isCardListMinimized}
          forceShow={this._forceShowCardList}
        />
      );
    }

    const mapSearch = locationGeocode
      ? (
        <MapSearch
          geocode={locationGeocode}
          ref={(ref) => { this.mapSearch = ref; }}
          onOpenDrawer={this._openDrawer}
        />
      )
      : (
        <MapSearch
          ref={(ref) => { this.mapSearch = ref; }}
          onOpenDrawer={this._openDrawer}
        />
      );

    return (
      <Container>
        <StatusBar hidden />
        { mapSearch }
        <Content style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Map
              markers={topMarkers}
              center={location ? location.coords : defaultCoords}
              selected={selectedMarker}
              onSelectedItem={this._onSelectedItem}
              showDirections={currentDirections}
              onPress={this._onMapPress}
              isError={false}
            />
            { stationList }
          </View>
        </Content>
      </Container>
    );
  }
}

HomeScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};
