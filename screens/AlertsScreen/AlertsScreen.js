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

import Lottie from 'lottie-react-native';

import SecondaryPageHeader from '../../components/SecondaryPageHeader';
import RSSItem from '../../components/RSSItem';
import { getFeed } from '../../lib/RSS';

import LogoMAE from '../../assets/images/logo-mae.png';

const { width } = Dimensions.get('window');

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

export default class AlertsScreen extends Component {
  state = {
    alerts: [],
  }

  async componentWillMount() {
    await getFeed({
      feedURL: 'http://www.mae.ro/warnings/feed',
      useFlickr: true
    }, (alerts) => {
      this.setState({ alerts });
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
      alerts,
    } = this.state;

    const animation = (
      <Lottie
        ref={animation => { this.animation = animation }}
        style={{ width: width - 16, height: width / 2, alignSelf: 'center', marginTop: 80 }}
        source={require('../../assets/animations/loading.json')}
      />
    );

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
          { alertsView.length ? alertsView : animation }
        </Content>
      </Container>
    );
  }
}

AlertsScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};
