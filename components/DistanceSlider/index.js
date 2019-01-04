import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  StyleSheet,
  Slider,
} from 'react-native';

import {
  Text,
} from 'native-base';

const styles = StyleSheet.create({
  slider: {
    flexGrow: 1,
    width: '100%',
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
    height: 50,
  },
  textCon: {
    flexGrow: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorGrey: {
    color: '#78909C',
    fontSize: 12,
  },
  colorYellow: {
    color: '#FF6D00',
  },
  sliderNumber: {
    fontWeight: 'bold',
  },
});

export default class DistanceSlider extends Component {
  state = {
    distance: null,
  };

  componentWillMount() {
    const { value } = this.props;
    const { distance } = this.state;
    if (!distance) {
      this.setState({
        distance: value,
      });
    }
  }

  render() {
    const {
      distance,
    } = this.state;

    const {
      minDistance,
      maxDistance,
      step,
      style,
    } = this.props;

    return (
      <View style={[styles.sliderContainer, style]}>
        <Slider
          style={styles.slider}
          maximumValue={maxDistance}
          minimumValue={minDistance}
          step={step}
          value={distance}
          onValueChange={val => this.setState({ distance: val })}
          thumbTintColor="#FDD835"
          maximumTrackTintColor="#F57F17"
          minimumTrackTintColor="#FDD835"
        />
        <View style={styles.textCon}>
          <Text style={styles.colorGrey}>
            <Text style={[styles.sliderNumber, styles.colorGrey]}>100</Text>
            km
          </Text>
          <Text style={styles.colorYellow}>
            <Text style={[styles.sliderNumber, styles.colorYellow]}>{distance}</Text>
            km
          </Text>
          <Text style={styles.colorGrey}>
            <Text style={[styles.sliderNumber, styles.colorGrey]}>2000</Text>
            km
          </Text>
        </View>
      </View>
    );
  }
}

DistanceSlider.propTypes = {
  minDistance: PropTypes.number,
  maxDistance: PropTypes.number,
  value: PropTypes.number,
  step: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

DistanceSlider.defaultProps = {
  minDistance: 100,
  maxDistance: 2000,
  value: 500,
  step: 100,
  style: {},
};
