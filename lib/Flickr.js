import { AsyncStorage } from 'react-native';
import { sha256 } from 'js-sha256';
import { oneLineTrim } from 'common-tags';

const API_KEY = 'ec160f6bbc845f91aa6c8ed5853ded1a';

export default class Flickr {
  constructor({ latitude, longitude }) {
    this.coords = {
      latitude,
      longitude,
    };
  }

  static _getFlickrURL({ latitude, longitude }) {
    return oneLineTrim`
      https://api.flickr.com/services/rest/?method=flickr.photos.search
        &api_key=${API_KEY}
        &accuracy=6
        &lat=${latitude}
        &lon=${longitude}
        &sort=interestingness-desc
        &format=json&nojsoncallback=1
    `;
  }

  static url(photoObj) {
    return oneLineTrim`
      https://farm${photoObj.farm}.staticflickr.com
        /${photoObj.server}
        /${photoObj.id}_${photoObj.secret}.jpg
    `;
  }

  async _getCacheKey() {
    const hash = sha256(this.coords.latitude.toFixed(1) + this.coords.longitude.toFixed(1));
    return `@FLICKR:${hash}`;
  }

  async getPhotos(limit = 50, trace) {
    const cacheKey = await this._getCacheKey(trace);
    const stored = await AsyncStorage.getItem(cacheKey);

    if (stored) {
      return JSON.parse(stored);
    }

    const rawPhotos = await fetch(
      this._getFlickrURL(this.coords),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    const jsonPhotos = await rawPhotos.json();
    if (!jsonPhotos.photos.photo) {
      return null;
    }
    const photos = jsonPhotos.photos.photo.slice(0, limit);
    await AsyncStorage.setItem(cacheKey, JSON.stringify(photos));

    return photos;
  }

  async getRandomPhoto(trace) {
    const photos = await this.getPhotos(50, trace);
    const ret = photos[Math.floor(Math.random() * photos.length)];
    return Flickr.url(ret);
  }
}
