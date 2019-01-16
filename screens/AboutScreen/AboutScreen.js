import React from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Text,
  Card,
  CardItem,
  Body,
  Content,
  Right,
  Icon,
  Left,
  List,
  ListItem,
  Button,
} from 'native-base';

import {
  StatusBar,
  StyleSheet,
  FlatList
} from 'react-native';

import SecondaryPageHeader from '../../components/SecondaryPageHeader';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CFD8DC',
  },
  link: {
    color: '#0366d6',
  }
});

handleWebLinkPress = (url) => {
  WebBrowser.openBrowserAsync(url);
}

const AboutScreen = ({ navigation }) => (
  <Container>
    <StatusBar hidden />
    <SecondaryPageHeader
      title="Despre"
      onOpenDrawer={() => navigation.toggleDrawer()}
      goBack={() => navigation.goBack()}
    />
    <Content style={styles.container} padder>
      <Card>
        <CardItem bordered>
          <Left>
            <Body>
              <Text style={{ fontWeight: 'bold' }}>Proveniența informațiilor</Text>
              <Text note>Lista surselor de date pentru datele afișate în aplicația RODiaspora</Text>
            </Body>
          </Left>
        </CardItem>

        <CardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
          <List style={{ flex: 1 }} noIndent>
            <ListItem icon onPress={() => handleWebLinkPress('https://github.com/gov-ithub/ro-diaspora/blob/master/src/providers/markers-data.ts')}>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon name="map-o" type="FontAwesome" />
                </Button>
              </Left>
              <Body>
                <Text>Localizare sectii de vot</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem icon onPress={() => handleWebLinkPress('http://www.mae.ro/travel-alerts')}>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon name="bell-o" type="FontAwesome" />
                </Button>
              </Left>
              <Body>
                <Text>Avertismente de calatorie</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem icon noBorder onPress={() => handleWebLinkPress('http://www.mae.ro/taxonomy/term/141')}>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon name="newspaper-o" type="FontAwesome" />
                </Button>
              </Left>
              <Body>
                <Text>Stiri</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </CardItem>
      </Card>
    </Content>
  </Container>
);

AboutScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};

export default AboutScreen;


{/* <Text style={{ marginTop: 20 }}>
<Text style={styles.header}>Atribuiri:</Text>
Map Pin Icons made by
{' '}<Text style={styles.link} onPress={() => handleWebLinkPress('https://www.freepik.com/')}>Freepik</Text>{' '}
from
{' '}<Text style={styles.link} onPress={() => handleWebLinkPress('https://www.flaticon.com/')}>www.flaticon.com</Text>{' '}
are licensed by
{' '}<Text style={styles.link} onPress={() => handleWebLinkPress('http://creativecommons.org/licenses/by/3.0/')}>CC 3.0 BY</Text>{' '}
</Text> */}
