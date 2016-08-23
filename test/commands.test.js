'use strict';

var expect = require('chai').expect;

var Commands = require('../commands');

describe('commands', function () {

    describe('processCommand', function () {

        it('should succeed with slack response', function () {

            var params = {
                text: 'go good news everyone',
                response_url: '_RESPONSE_URL_',
            };

            var morbotron = {
                getMemeImageUrl: function () {
                    return Promise.resolve({
                        captionUrl: '_CAPTION_URL_',
                        imageUrl: '_IMAGE_URL_',
                    });
                },
            };

            var slack = {};
            var slackPromise = new Promise(function (resolve) {
                slack.respond = function (url, message) {
                    expect(url).to.eq('_RESPONSE_URL_');
                    expect(message.response_type).to.equal('in_channel');
                    expect(message.attachments).ok;
                    expect(message.attachments.length).to.equal(1);
                    expect(message.attachments[0].title).to.equal('good news everyone');
                    expect(message.attachments[0].title_link).to.equal('_CAPTION_URL_');
                    expect(message.attachments[0].image_url).to.equal('_IMAGE_URL_');
                    return resolve();
                };
            })

            var commands = new Commands(morbotron, slack);
            var commandPromise = commands.processCommand(params)
                .then(function (message) {
                    expect(message.text).to.contain('"good news everyone"');
                });

            return Promise.all([commandPromise, slackPromise]);

        });

    });

});