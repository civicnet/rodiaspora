import React from 'react';
import PropTypes from 'prop-types';

import {
  Image,
  ImageBackground,
} from 'react-native';

import {
  Container,
  Content,
  Text,
  List,
  ListItem,
} from 'native-base';

const routes = ['Home', 'Chat', 'Profile'];

const Sidebar = ({ navigation }) => (
  <Container>
    <Content>
      <ImageBackground
        source={{
          uri: 'https://raw.githubusercontent.com/gov-ithub/ro-diaspora/master/resources/android/splash/drawable-land-mdpi-screen.png',
        }}
        style={{
          height: 120,
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          square
          style={{ height: 80, width: 70 }}
          source={{
            uri: 'https://raw.githubusercontent.com/gov-ithub/ro-diaspora/master/resources/android/icon/drawable-xxhdpi-icon.png',
          }}
        />
      </ImageBackground>
      <List
        dataArray={routes}
        renderRow={data => (
          <ListItem
            button
            onPress={() => navigation.navigate(data)}
          >
            <Text>{data}</Text>
          </ListItem>
        )}
      />
    </Content>
  </Container>
);

Sidebar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};

export default Sidebar;
