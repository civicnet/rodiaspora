import React from 'react';

import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';

import {
  Button,
  Icon,
  Text,
  Card,
  CardItem,
  Left,
  Body,
  Thumbnail,
} from 'native-base';

import Warning from '../../assets/images/warning.png';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    width: width - 16,
  },
});

const LocationErrorCard = () => (
  <View style={styles.container}>
    <Card>
      <CardItem>
        <Left>
          <Thumbnail source={Warning} square />
          <Body>
            <Text style={{ fontWeight: 'bold' }}>Nu reușim să te localizăm</Text>
            <Text note>Ai activat serviciile de localizare?</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody>
        <Body style={{ padding: 16 }}>
          <Text>
            Aplicația RODiaspora este construită în jurul funcției de localizare.
          </Text>
          <Text style={{ marginTop: 16 }}>
            Poți citi mai multe despre modul în care utilizăm locația, cât și despre
            politica noastră de confidențialitate în secțiunea &quot;Despre&quot; a aplicației.
          </Text>
        </Body>
      </CardItem>
      <CardItem>
        <Left>
          <Button transparent disabled>
            <Icon active name="settings" type="Feather" />
            <Text>Setări</Text>
          </Button>
        </Left>
        <Body>
          <Button transparent disabled>
            <Icon active name="file-text-o" type="FontAwesome" />
            <Text>Confidențialitate</Text>
          </Button>
        </Body>
      </CardItem>
    </Card>
  </View>
);

export default LocationErrorCard;
