import React from 'react';
import PropTypes from 'prop-types';

import {
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

import {
  Container,
  Content,
  Text,
  List,
  Footer,
  FooterTab,
  ListItem,
} from 'native-base';

import Logo from '../../assets/images/passport.png';

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 26,
    fontFamily: 'RobotoSlab',
    marginTop: 10,
  },
  footerTab: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

const routes = [
  {
    name: 'Secții vot',
    route: 'Home',
  },
  {
    name: 'Știri',
    route: 'News',
  },
  {
    name: 'Despre',
    route: 'About',
  },
];

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
          style={{ height: 50, width: 50 }}
          source={Logo}
        />
        <Text style={styles.title}>
          RODiaspora
        </Text>
      </ImageBackground>
      <List
        dataArray={routes}
        renderRow={data => (
          <ListItem
            button
            onPress={() => navigation.navigate(data.route)}
          >
            <Text>{data.name}</Text>
          </ListItem>
        )}
      />
    </Content>
    <Footer>
      <FooterTab style={styles.footerTab}>
        <Text style={styles.footerText}>
          Copyright @ 2019 / CivicTech România
        </Text>
      </FooterTab>
    </Footer>
  </Container>
);

Sidebar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};

export default Sidebar;
