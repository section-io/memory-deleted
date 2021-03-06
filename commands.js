'use strict';

function padEpisodeComponent(component) {
    if (component.length === 2) {
        return component;
    }
    return `0${component}`;
}

module.exports = function Commands(morbotron, slack) {

    function processMeme(responseUrl, searchText) {
        var episode;
        var match = /^s(\d{1,2})e(\d{1,2}) +(.+)$/.exec(searchText);
        if (match) {
            var season = padEpisodeComponent(match[1]);
            var epNum = padEpisodeComponent(match[2]);
            episode = `S${season}E${epNum}`;
            searchText = match[3];
        }

        morbotron.getMemeImageUrl(searchText, episode)
            .then((result) => {

                return slack.respond(responseUrl, {
                    response_type: 'in_channel',
                    attachments: [
                        // https://api.slack.com/docs/message-attachments
                        {
                            title: searchText,
                            title_link: result.captionUrl,
                            image_url: result.imageUrl,
                        }
                    ]
                });

            })
            .catch(function (err) {
                console.error(err);
            });

        return Promise.resolve({
            text: `Finding meme for "${searchText}"...`
        });
    }

    function processFind(responseUrl, searchText) {
        morbotron.findCaptions(searchText)
            .then(function (result) {

                // TODO different response if zero matches
                // TODO escape searchUrl and searchText control sequences (ie `&`, `<`, `>`, maybe `|`)
                return slack.respond(responseUrl, {
                    response_type: 'ephemeral',
                    text: `Morbotron results for "<${result.searchUrl}|${searchText}>"`,
                    attachments: result.results.map(function (item) {
                        // https://api.slack.com/docs/message-attachments
                        return {
                            title: `${item.episode} ${item.episodeTitle} @ ${item.timestamp}`,
                            title_link: item.captionUrl,
                            text: item.subtitles,
                            thumb_url: item.thumbUrl,
                        };
                    }),
                });

            })
            .catch(function (err) {
                console.error(err);
            });


        return Promise.resolve({
            text: `Finding matches for "${searchText}"...`
        });
    }

    this.processCommand = function processCommand(params) {

        var commandText = params.text;
        var responseUrl = params.response_url;

        var searchText;

        var match = /^(?:meme|go) +(.+)$/.exec(commandText);
        if (match) {
            searchText = match[1];
            return processMeme(responseUrl, searchText);
        }

        match = /^find +(.+)$/.exec(commandText);
        if (match) {
            searchText = match[1];
            return processFind(responseUrl, searchText);
        }

        return Promise.reject("Unknown command");
    };

};
