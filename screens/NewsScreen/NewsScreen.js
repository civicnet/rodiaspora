import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Content,
} from 'native-base';

import {
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { DangerZone } from 'expo';
let { Lottie } = DangerZone;

import he from 'he';

import { parseString } from 'react-native-xml2js';

import SecondaryPageHeader from '../../components/SecondaryPageHeader';

import LogoMAE from '../../assets/images/logo-mae.png';
import RSSItem from '../../components/RSSItem';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CFD8DC',
    flex: 1,
  },
});

const FEED = 'http://www.mae.ro/rss.xml';

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
            // Every description includes a paragraph
            // with a "read more" anchor - remove that
            description: he.decode(item.description[0]).replace(/(<a.*<\/a>|<p.*<\/p>)/g, ''),
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

    const itemsView = items.map(item => <RSSItem logo={ LogoMAE } key={Math.random()} { ...item } />);

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
