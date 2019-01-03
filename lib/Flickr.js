import { AsyncStorage } from 'react-native';
import { sha256 } from 'js-sha256';
import { oneLineTrim } from 'common-tags';

const API_KEY = 'ec160f6bbc845f91aa6c8ed5853ded1a';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

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
        &text=city
    `;
  }

  static url(photoObj) {
    return oneLineTrim`
      https://farm${photoObj.farm}.staticflickr.com
        /${photoObj.server}
        /${photoObj.id}_${photoObj.secret}.jpg
    `;
  }

  _getCacheKey() {
    const hash = sha256(this.coords.latitude.toFixed(1) + this.coords.longitude.toFixed(1));
    return `@FLICKR:${hash}`;
  }

  _getExpirationCacheKey() {
    return `${this._getCacheKey()}:expiration`;
  }

  async getPhotos(limit = 50) {
    const expirationCacheKey = this._getExpirationCacheKey();
    const lastCache = await AsyncStorage.getItem(expirationCacheKey);
    const now = new Date();

    const cacheKey = this._getCacheKey();
    if (lastCache - now < CACHE_DURATION) {
      const stored = await AsyncStorage.getItem(cacheKey);

      if (stored) {
        return JSON.parse(stored);
      }
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
    await AsyncStorage.setItem(expirationCacheKey, now);

    return photos;
  }

  async getRandomPhoto(limit = 50) {
    const photos = await this.getPhotos(limit);
    const ret = photos[Math.floor(Math.random() * photos.length)];
    return Flickr.url(ret);
  }
}
