import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Text,
  Content,
  Button,
  Card,
  CardItem,
  Thumbnail,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';

import {
  StatusBar,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';

import {
  WebBrowser,
} from 'expo';

import he from 'he';

import moment from 'moment';
import 'moment/locale/ro';

import { parseString } from 'react-native-xml2js';

import SecondaryPageHeader from '../../components/SecondaryPageHeader';
import Flickr from '../../lib/Flickr';

import LogoMAE from '../../assets/images/logo-mae.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CFD8DC',
  },
  cardPhoto: {
    height: 160,
    width: '100%',
    flex: 1,
  },
});

const FEED = 'http://www.mae.ro/warnings/feed';

moment.locale('ro');

export default class AlertsScreen extends Component {
  state = {
    alerts: [],
  }

  async componentWillMount() {
    const feed = await fetch(FEED);
    const body = await feed.text();

    parseString(body, async (err, result) => {
      const parsedAlerts = result.rss.channel[0].item.map(
        async item => ({
          tags: item.category.map((category) => {
            // For some reason, MAE applies one lowercase and one uppercase tag, identical.
            // Only the lowercase one has a relatively valid link to mae.ro
            if (category._ === category._.toUpperCase()) {
              return null;
            }

            return {
              name: category._,
              url: category.$.domain,
            };
          }).filter(tag => tag !== null),
          description: item.description[0],
          url: item.link[0],
          title: item.title[0],
          date: item.pubDate[0],
          photo: await Flickr.getCountryPhoto(item.title[0]),
        }),
      );

      const resolvedAlerts = await Promise.all(parsedAlerts);
      const alerts = resolvedAlerts.sort((a, b) => new Date(b.date) - new Date(a.date));

      this.setState({
        alerts,
      });
    });
  }

  _handleWebLinkPress = (url) => {
    WebBrowser.openBrowserAsync(url);
  }

  render() {
    const {
      navigation,
    } = this.props;

    const {
      alerts,
    } = this.state;

    const alertsView = alerts.map((alert) => {
      // Every description includes a paragraph
      // with a "read more" anchor - remove that
      const description = he.decode(
        alert.description,
      ).replace(/(<a.*<\/a>|<p.*<\/p>)/g, '');

      return (
        <Card key={Math.random()} style={{ flex: 0 }}>
          <CardItem bordered>
            <Left>
              <Thumbnail source={LogoMAE} />
              <Body>
                <Text>{alert.title}</Text>
                <Text note>{moment(alert.date).fromNow()}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Image
                source={{ uri: alert.photo }}
                style={styles.cardPhoto}
              />
              <Text style={{ marginTop: 16 }}>{description}</Text>
            </Body>
          </CardItem>
          <CardItem bordered>
            <FlatList
              data={alert.tags}
              horizontal
              keyExtractor={tag => tag.name}
              renderItem={({ item }) => (
                <Button
                  bordered
                  iconLeft
                  info
                  style={{ marginRight: 16 }}
                  onPress={() => this._handleWebLinkPress(item.url)}
                >
                  <Icon
                    active
                    name="external-link"
                    type="FontAwesome"
                    style={{ fontSize: 12 }}
                  />
                  <Text style={{ fontSize: 12 }}>
                    {item.name}
                  </Text>
                </Button>
              )}
            />
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent iconLeft>
                <Icon active name="share-alt" type="FontAwesome" />
                <Text>Distribuie</Text>
              </Button>
            </Left>
            <Body>
              <Button
                transparent
                iconLeft
                onPress={() => this._handleWebLinkPress(alert.url)}
              >
                <Icon active name="external-link" type="FontAwesome" />
                <Text>Citește</Text>
              </Button>
            </Body>
            <Right>
              <Button
                transparent
                info
                onPress={() => this._handleWebLinkPress('http://www.mae.ro/')}
              >
                <Text style={{ fontSize: 10 }}>www.mae.ro</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      );
    });

    return (
      <Container>
        <StatusBar hidden />
        <SecondaryPageHeader
          title="Avertismente de călătorie"
          onOpenDrawer={() => navigation.toggleDrawer()}
          goBack={() => navigation.goBack()}
        />
        <Content style={styles.container} padder>
          {alertsView}
        </Content>
      </Container>
    );
  }
}

AlertsScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};
