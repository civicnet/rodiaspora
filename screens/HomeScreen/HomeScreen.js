import React from 'react';

import {
  Platform,
  View,
  StatusBar,
  AsyncStorage,
} from 'react-native';

import {
  Constants,
  Location,
  Permissions,
} from 'expo';

import {
  Container,
  Text,
  Spinner,
  Content,
} from 'native-base';

import Directions from '@mapbox/mapbox-sdk/services/directions';
import { sha256 } from 'js-sha256';
import { oneLineTrim } from 'common-tags';

import Map from '../../components/Map';
import MapSearch from '../../components/MapSearch';
import VotingStationList from '../../components/VotingStationList';
import Geo from '../../lib/Geo';

import * as MarkerLocations from '../../assets/data/markers-data.json';

const directionsClient = Directions({
  accessToken: 'pk.eyJ1IjoiY2xhdWRpdWMiLCJhIjoiY2lrZXV5dzNiMDA3NnRvbHlwMWc3ZHp4YiJ9.8DeWMyPr2T8jRDeShSebTQ',
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
    isCardListHidden: false,
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
        errorMessage: 'Permission to access location was denied',
      });
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    const locationGeocode = await Location.reverseGeocodeAsync({
      ...location.coords,
    });

    this.setState({ location, locationGeocode });
  };

  _onSelectedItem = (item) => {
    this.setState({
      selectedMarker: item,
      isCardListHidden: false,
    });
  }

  _onMapPress = () => {
    this.setState({
      isCardListHidden: true,
    });
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
        isCardListHidden: false,
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
      isCardListHidden: false,
    });
  }

  _forceShowCardList = () => this.setState({ isCardListHidden: false });

  render() {
    const {
      errorMessage,
      location,
      locationGeocode,
      markers,
      selectedMarker,
      currentDirections,
      isCardListHidden,
    } = this.state;

    if (errorMessage) {
      return (
        <Text>{errorMessage}</Text>
      );
    }

    if (!location || !location.coords || !locationGeocode || !markers) {
      return <Spinner />;
    }

    const topMarkers = HomeScreen._calculateOrderedMarkers(
      markers,
      location,
    ).filter(marker => marker.distance <= 1000 * 500);

    return (
      <Container>
        <StatusBar hidden />
        <MapSearch
          geocode={locationGeocode}
        />
        <Content style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Map
              markers={topMarkers}
              center={location.coords}
              selected={selectedMarker}
              onSelectedItem={this._onSelectedItem}
              showDirections={currentDirections}
              onPress={this._onMapPress}
            />
            <VotingStationList
              markers={topMarkers}
              selected={selectedMarker}
              onSelectedItem={this._onSelectedItem}
              onShowRoute={this._onShowRoute}
              showDirections={currentDirections}
              hidden={isCardListHidden}
              forceShow={this._forceShowCardList}
            />
          </View>
        </Content>
      </Container>
    );
  }
}
