import React from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Text,
  Content,
  Button,
} from 'native-base';

import {
  StatusBar,
  StyleSheet,
} from 'react-native';

import SecondaryPageHeader from '../../components/SecondaryPageHeader';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CFD8DC',
  },
});

const NewsScreen = ({ navigation }) => (
  <Container>
    <StatusBar hidden />
    <SecondaryPageHeader
      title="Știri"
      onOpenDrawer={() => navigation.toggleDrawer()}
      goBack={() => navigation.goBack()}
    />
    <Content style={styles.container}>
      <Text>Știri</Text>
      <Button onPress={() => navigation.navigate('Home')}>
        <Text>Home</Text>
      </Button>
    </Content>
  </Container>
);

NewsScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};

export default NewsScreen;
