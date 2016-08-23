'use strict';

module.exports = function Commands (morbotron) {

    this.processCommand = function processCommand (params) {

        var user = params.user_name;//
        var command = params.command;//
        var channel = params.channel_name;//
        var commandText = params.text;

        var match = /^go +(.+)$/.exec(commandText);
        if (!match) {
            return Promise.reject("Unknown command");
        }

        var searchText = match[1];
        var result = morbotron.getMemeImageUrl(searchText)
            .then((result) => {
                // TODO respond via response_url to bypass 3-second timeout https://api.slack.com/slash-commands#responding_to_a_command
                return {
                    response_type: 'in_channel',
                    attachments: [
                        // https://api.slack.com/docs/message-attachments
                        {
                            title: searchText,
                            title_link: result.captionUrl,
                            image_url: result.imageUrl,
                        }
                    ]
                };

            });

        return result;
    };

};
