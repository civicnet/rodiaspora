import React from 'react';

import {
  StyleSheet,
  View,
  FlatList,
  Image,
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
  Right,
} from 'native-base';

import {
  WebBrowser,
} from 'expo';

import moment from 'moment';
import 'moment/locale/ro';

moment.locale('ro');

const styles = StyleSheet.create({
  cardPhoto: {
    height: 160,
    width: '100%',
    flex: 1,
  },
});

handleWebLinkPress = (url) => {
  WebBrowser.openBrowserAsync(url);
}

const RSSItem = ({ title, date, photo, tags, url, style, description, logo }) => (
  <View style={style}>
    <Card style={{ flex: 0 }}>
      <CardItem bordered>
        <Left>
          <Thumbnail source={logo} />
          <Body>
            <Text>{title}</Text>
            <Text note>{moment(date).fromNow()}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem bordered>
        <Body>
          {
            photo
              ? <Image
                  source={{ uri: photo }}
                  style={styles.cardPhoto}
                />
              : null
          }
          <Text style={{ marginTop: 16 }}>{description}</Text>
        </Body>
      </CardItem>
      <CardItem bordered>
        <FlatList
          data={tags}
          horizontal
          keyExtractor={tag => tag.name}
          renderItem={({ item }) => (
            <Button
              bordered
              iconLeft
              info
              style={{ marginRight: 16 }}
              onPress={() => handleWebLinkPress(item.url)}
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
            onPress={() => handleWebLinkPress(url)}
          >
            <Icon active name="external-link" type="FontAwesome" />
            <Text>Citește</Text>
          </Button>
        </Body>
        <Right>
          <Button
            transparent
            info
            onPress={() => handleWebLinkPress('http://www.mae.ro/')}
          >
            <Text style={{ fontSize: 10 }}>www.mae.ro</Text>
          </Button>
        </Right>
      </CardItem>
    </Card>
  </View>
);

export default RSSItem;
