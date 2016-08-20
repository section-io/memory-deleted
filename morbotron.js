'use strict';

var qs = require('qs');
var rp = require('request-promise');

function getMemeImageUrl(searchText) {
    var data = {};
    var promise = rp({ url: 'https://morbotron.com/api/search', qs: { q: searchText }, json: true })
        .then((json) => {
            if (json.length && json[0].Episode && json[0].Timestamp) {
                data.episode = json[0].Episode;
                data.timestamp = json[0].Timestamp;
                return rp({ url: 'https://morbotron.com/api/caption', qs: {
                    e: data.episode,
                    t: data.timestamp,
                }, json: true });
            } else {
                throw new Error('No search results');
            }
        })
        .then((json) => {
            if (json.Subtitles && json.Subtitles.length) {
                var lines = json.Subtitles
                    .sort(function (a, b) {
                        return a.RepresentativeTimestamp - b.RepresentativeTimestamp;
                    })
                    .map(sub => sub.Content)
                    .join('\n');

                var encoded = new Buffer(lines).toString('base64')
                    .replace(/\+/g, '-').replace(/\//g, '_');

                var querystring = qs.stringify({ b64lines: encoded });
                var imageUrl = `https://morbotron.com/meme/${data.episode}/${data.timestamp}.jpg?${querystring}`;

                var captionUrl = `https://morbotron.com/caption/${data.episode}/${data.timestamp}`;

                return {
                    captionUrl: captionUrl,
                    imageUrl: imageUrl,
                };
            } else {
                throw new Error('No subtitles for search result');
            }
        });
    return promise;
}

exports.getMemeImageUrl = getMemeImageUrl;
