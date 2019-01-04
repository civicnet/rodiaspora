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
} from 'react-native';

const NewsScreen = ({ navigation }) => (
  <Container>
    <StatusBar hidden />
    <Content>
      <Text>Stiri</Text>
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
