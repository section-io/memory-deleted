'use strict';

module.exports = function Commands (morbotron, slack) {

    function processMeme (responseUrl, searchText) {
        morbotron.getMemeImageUrl(searchText)
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

    function processFind (responseUrl, searchText) {
        morbotron.findCaptions(searchText)
            .then(function (result) {

                // TODO different response if zero matches
                // TODO escape searchUrl and searchText control sequences (ie `&`, `<`, `>`, maybe `|`)
                return slack.respond(responseUrl, {
                    response_type: 'in_channel',
                    text: `<${result.searchUrl}|${searchText}>`,
                    attachments: result.results.map(function (item) {
                        // https://api.slack.com/docs/message-attachments
                        return {
                            title: `${item.episode} @ ${item.timestamp}`,
                            title_link: item.captionUrl,
                            text: item.subtitle,
                            thumb_url: item.thumbUrl,
                        }
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

    this.processCommand = function processCommand (params) {

        var commandText = params.text;
        var responseUrl = params.response_url;

        var match = /^go +(.+)$/.exec(commandText);
        if (match) {
            var searchText = match[1];
            return processMeme(responseUrl, searchText);
        }

        match = /^find +(.+)$/.exec(commandText);
        if (match) {
            var searchText = match[1];
            return processFind(responseUrl, searchText);
        }

        return Promise.reject("Unknown command");
    };

};
