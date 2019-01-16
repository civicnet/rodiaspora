
import he from 'he';
import { parseString } from 'react-native-xml2js';
import Flickr from './Flickr';

const getFeed = async (config, callback) => {
  const feed = await fetch(config.feedURL);
  const body = await feed.text();

  return parseString(body, async (_, result) => {
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
        photo: item.enclosure
          ? item.enclosure[0].$.url
          : config.useFlickr ? await Flickr.getCountryPhoto(item.title[0]) : null,
      }),
    );

    const resolvedItems = await Promise.all(parsedItems);
    const items = resolvedItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    callback(items);
  });
}

module.exports = {
  getFeed
}
