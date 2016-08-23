'use strict';

module.exports = function Commands (morbotron, slack) {

    this.processCommand = function processCommand (params) {

        var commandText = params.text;
        var responseUrl = params.response_url;

        var match = /^go +(.+)$/.exec(commandText);
        if (!match) {
            return Promise.reject("Unknown command");
        }

        var searchText = match[1];
        var result = morbotron.getMemeImageUrl(searchText)
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
    };

};
