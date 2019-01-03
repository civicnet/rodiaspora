import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  Item,
  Input,
  Header,
} from 'native-base';

const MapSearch = ({ geocode }) => (
  <Header searchBar rounded style={{ backgroundColor: '#B0BEC5' }}>
    <Item>
      <Icon active name="my-location" type="MaterialIcons" style={{ color: '#29B6F6' }} />
      <Input placeholder={`${geocode[0].city}, ${geocode[0].country}`} />
      <Icon name="search" type="FontAwesome" style={{ color: '#37474F' }} />
    </Item>
    <Button transparent dark style={{ width: 60 }}>
      <Icon name="bars" type="FontAwesome" style={{ color: '#37474F' }} />
    </Button>
  </Header>
);

MapSearch.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  geocode: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  // coords: PropTypes.object.isRequired,
};

export default MapSearch;
