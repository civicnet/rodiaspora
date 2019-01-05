import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

import {
  Text,
} from 'native-base';

import { sha256 } from 'js-sha256';
import chroma from 'chroma-js';

import VotingStationCard from '../VotingStationCard';

const { height } = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = 300;

const styles = StyleSheet.create({
  container: {
  },
  markerCount: {
    fontWeight: 'bold',
  },
  distance: {
    fontWeight: 'bold',
  },
  searchResult: {
    marginLeft: 8,
  },
  text: {
    color: '#000',
    textShadowColor: '#fff',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 3,
  },
});

const CARD_COLOR_COUNT = 8;

export default class VotingStationList extends React.Component {
  flatList = null;

  cardColors = null;

  bottomMargin = new Animated.Value(0);

  viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
    waitForInteraction: false,
  }

  state = {
    selectedMarkerIndex: 0,
  }

  componentDidUpdate(prevProps) {
    const {
      selected,
      hidden,
      markers,
    } = this.props;

    if (markers.length) {
      this.cardColors = chroma
        .scale(['#91cf60', '#ffffbf', '#fc8d59'])
        .classes(CARD_COLOR_COUNT);
    }

    if (hidden && !prevProps.hidden) {
      this._animateSwipeDown();
    }

    if (!hidden && prevProps.hidden) {
      this._animateSwipeUp();
    }

    const { selectedMarkerIndex } = this.state;
    if (!selected || selected.index === selectedMarkerIndex) {
      return;
    }

    this._onChangeSelected(selected, selected.index);
  }

  _updateHighlightedMarker = ({ viewableItems }) => {
    if (!viewableItems.length) {
      return;
    }

    this.setState({
      selectedMarkerIndex: viewableItems[0].index,
    });

    const { onSelectedItem } = this.props;
    if (onSelectedItem) {
      onSelectedItem(viewableItems[0].item);
    }
  }

  _onChangeSelected = (item, index) => {
    // If we're "reselecting" the same pin, the "hidden" prop doesn't get updated
    const { selectedMarkerIndex } = this.state;
    const { forceShow } = this.props;

    if (selectedMarkerIndex === index) {
      // this._animateSwipeUp();
      forceShow();
    }
    this.flatList.scrollToIndex({ index });
  };

  _getItemLayout = (data, index) => ({
    length: CARD_WIDTH + 8,
    offset: (CARD_WIDTH + 8) * index,
    index,
  });

  _keyExtractor = item => sha256(item.name)

  _renderCard = ({ item, index }) => {
    const {
      selectedMarkerIndex,
    } = this.state;

    const {
      onShowRoute,
      // markers,
    } = this.props;

    // const countMarkers = markers.length ? markers.length : 1;
    /* const color = this.cardColors
      ? chroma(this.cardColors[index / countMarkers]).darken(3).toString()
      : '#000'; */

    return (
      <TouchableOpacity onPress={() => this._onChangeSelected(item, index)}>
        <View style={{ width: CARD_WIDTH, margin: 4 }}>
          <VotingStationCard
            height={CARD_HEIGHT}
            highlighted={selectedMarkerIndex === index}
            name={item.name}
            address={item.address}
            country={item.country}
            color="#000"
            distance={Math.floor(item.distance / 1000)}
            coords={{ latitude: item.latitude, longitude: item.longitude }}
            onShowRoute={(target, pos) => {
              this._onChangeSelected(item, index);
              onShowRoute(target, pos);
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  _animateSwipeUp() {
    Animated.spring(
      this.bottomMargin,
      {
        toValue: 0,
        duration: 500,
        friction: 3,
      },
    ).start();
  }

  _animateSwipeDown() {
    Animated.spring(
      this.bottomMargin,
      {
        toValue: -220,
        duration: 200,
        friction: 3,
      },
    ).start();
  }

  render() {
    const {
      markers,
      distance,
    } = this.props;

    const animatedStyle = {
      position: 'absolute',
      bottom: this.bottomMargin,
      marginLeft: 4,
      marginRight: 4,
    };

    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={[styles.text, styles.searchResult]}>
          <Text style={[styles.text, styles.markerCount]}>
            {`${markers.length} `}
          </Text>
          stații de vot, pe o rază de
          <Text style={[styles.text, styles.distance]}>
            {` ${distance}`}
          </Text>
          km
        </Text>
        <FlatList
          ref={(list) => {
            this.flatList = list;
          }}
          horizontal
          data={markers}
          getItemLayout={this._getItemLayout}
          keyExtractor={this._keyExtractor}
          viewabilityConfig={this.viewabilityConfig}
          onViewableItemsChanged={this._updateHighlightedMarker}
          renderItem={this._renderCard}
        />
      </Animated.View>
    );
  }
}

VotingStationList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  markers: PropTypes.array.isRequired,
  hidden: PropTypes.bool.isRequired,
  onShowRoute: PropTypes.func.isRequired,
  onSelectedItem: PropTypes.func.isRequired,
  forceShow: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selected: PropTypes.object,
  distance: PropTypes.number.isRequired,
};

VotingStationList.defaultProps = {
  selected: null,
};
