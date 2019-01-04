import React from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Text,
  Button,
  Content,
} from 'native-base';

import {
  StatusBar,
} from 'react-native';

const AboutScreen = ({ navigation }) => (
  <Container>
    <StatusBar hidden />
    <Content>
      <Text>Despre</Text>
      <Button onPress={() => navigation.navigate('Home')}>
        <Text>Home</Text>
      </Button>
    </Content>
  </Container>
);

AboutScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};

export default AboutScreen;
