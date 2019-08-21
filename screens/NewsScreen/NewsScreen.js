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
    flex: 1,
  },
});

export default class NewsScreen extends Component {
  state = {
    items: [],
  }

  async componentWillMount() {
    await getFeed({
      feedURL: 'http://www.mae.ro/rss.xml',
      useFlickr: false
    }, (items) => {
      this.setState({ items });
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
