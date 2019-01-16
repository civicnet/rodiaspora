import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Content,
} from 'native-base';

import {
  StatusBar,
  StyleSheet,
} from 'react-native';

import he from 'he';

import { parseString } from 'react-native-xml2js';

import SecondaryPageHeader from '../../components/SecondaryPageHeader';
import Flickr from '../../lib/Flickr';
import RSSItem from '../../components/RSSItem';

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
          // Every description includes a paragraph
          // with a "read more" anchor - remove that
          description: he.decode(item.description[0]).replace(/(<a.*<\/a>|<p.*<\/p>)/g, ''),
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

  render() {
    const {
      navigation,
    } = this.props;

    const {
      alerts,
    } = this.state;

    const alertsView = alerts.map(item => <RSSItem logo={ LogoMAE } key={Math.random()} { ...item } />);

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
