import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { sha256 } from 'js-sha256';
import VotingStationCard from '../VotingStationCard';

const { height } = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = 300;

export default class VotingStationList extends React.Component {
  flatList = null;

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
    } = this.props;

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
      // this.flatList.scrollToIndex({ index: viewableItems[0].index });
    }
  }

  _onChangeSelected = (item, index) => {
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
    } = this.props;

    return (
      <TouchableOpacity onPress={() => this._onChangeSelected(item, index)}>
        <View style={{ width: CARD_WIDTH, margin: 4 }}>
          <VotingStationCard
            height={CARD_HEIGHT}
            highlighted={selectedMarkerIndex === index}
            name={item.name}
            address={item.address}
            country={item.country}
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
    } = this.props;

    const animatedStyle = {
      position: 'absolute',
      bottom: this.bottomMargin,
      marginLeft: 4,
      marginRight: 4,
    };

    return (
      <Animated.View style={animatedStyle}>
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
  // eslint-disable-next-line react/forbid-prop-types
  selected: PropTypes.object,
};

VotingStationList.defaultProps = {
  selected: null,
};
