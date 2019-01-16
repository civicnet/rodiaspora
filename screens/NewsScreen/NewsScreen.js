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
  Dimensions,
} from 'react-native';

import {
  WebBrowser,
} from 'expo';

import { DangerZone } from 'expo';
let { Lottie } = DangerZone;

import he from 'he';

import moment from 'moment';
import 'moment/locale/ro';

import { parseString } from 'react-native-xml2js';

import SecondaryPageHeader from '../../components/SecondaryPageHeader';

import LogoMAE from '../../assets/images/logo-mae.png';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CFD8DC',
    flex: 1,
  },
  cardPhoto: {
    height: 160,
    width: '100%',
    flex: 1,
  },
});

const FEED = 'http://www.mae.ro/rss.xml';

moment.locale('ro');

export default class NewsScreen extends Component {
  state = {
    items: [],
  }

  async componentWillMount() {
    const feed = await fetch(FEED);
    const body = await feed.text();

    parseString(body, async (err, result) => {
      const parsedItems = result.rss.channel[0].item.map(
        async item => ({
          tags: item.category
            ? item.category.map((category) => {
                // For some reason, MAE applies one lowercase and one uppercase tag, identical.
                // Only the lowercase one has a relatively valid link to mae.ro
                if (category._ === category._.toUpperCase()) {
                  return null;
                }

                return {
                  name: category._,
                  url: category.$.domain,
                };
              }).filter(tag => tag !== null)
            : [],
            description: item.description[0],
            url: item.link[0],
            title: item.title[0],
            date: item.pubDate[0],
            photo: item.enclosure ? item.enclosure[0].$.url : null,
          }),
        );

      const resolvedItems = await Promise.all(parsedItems);
      const items = resolvedItems.sort((a, b) => new Date(b.date) - new Date(a.date));

      this.setState({
        items,
      });
    });
  }

  componentDidMount = () => {
    this.animation && this.animation.play();
  }

  _handleWebLinkPress = (url) => {
    WebBrowser.openBrowserAsync(url);
  }

  render() {
    const {
      navigation,
    } = this.props;

    const {
      items,
    } = this.state;

    const animation = (
      <Lottie
        ref={animation => { this.animation = animation }}
        style={{ width: width - 16, height: width / 2, alignSelf: 'center', marginTop: 80 }}
        source={require('../../assets/animations/loading.json')}
      />
    );

    const itemsView = items.map((item) => {
      // Every description includes a paragraph
      // with a "read more" anchor - remove that
      const description = he.decode(
        item.description,
      ).replace(/(<a.*<\/a>|<p.*<\/p>)/g, '');

      return (
        <Card key={Math.random()} style={{ flex: 0 }}>
          <CardItem bordered>
            <Left>
              <Thumbnail source={LogoMAE} />
              <Body>
                <Text>{item.title}</Text>
                <Text note>{moment(item.date).fromNow()}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem bordered>
            <Body>
              {
                item.photo
                  ? <Image
                      source={{ uri: item.photo }}
                      style={styles.cardPhoto}
                    />
                  : null
              }
              <Text style={{ marginTop: 16 }}>{description}</Text>
            </Body>
          </CardItem>
          <CardItem bordered>
            <FlatList
              data={item.tags}
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
                onPress={() => this._handleWebLinkPress(item.url)}
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
          title="Stiri"
          onOpenDrawer={() => navigation.toggleDrawer()}
          goBack={() => navigation.goBack()}
        />
        <Content style={styles.container} padder>
          { itemsView.length ? itemsView : animation }
        </Content>
      </Container>
    );
  }
}

NewsScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};
