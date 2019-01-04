import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';

import {
  Button,
  Icon,
  Text,
} from 'native-base';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    maxHeight: 56,
  },
  button: {
  },
  icon: {
    color: '#37474F',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'RobotoSlab_bold',
    color: '#263238',
    textAlign: 'center',
  },
});

const SecondaryPageHeader = ({ goBack, onOpenDrawer, title }) => (
  <View style={styles.container}>
    <Button transparent dark style={styles.button} onPress={goBack}>
      <Icon name="chevron-left" type="FontAwesome" style={styles.icon} />
    </Button>
    <Text style={styles.title}>{title}</Text>
    <Button transparent dark style={styles.button} onPress={onOpenDrawer}>
      <Icon name="bars" type="FontAwesome" style={styles.icon} />
    </Button>
  </View>
);

SecondaryPageHeader.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  title: PropTypes.string.isRequired,
  onOpenDrawer: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};

export default SecondaryPageHeader;
