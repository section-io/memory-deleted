'use strict';

var expect = require('chai').expect;

var Commands = require('../commands');

describe('commands', function () {

    describe('processCommand', function () {

        it('should succeed with slack response for `meme <search text>`', function () {

            var params = {
                text: 'meme good news everyone',
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

        it('should succeed with slack response for `meme <episode> <search text>`', function () {

            var params = {
                text: 'meme s1e07 good news everyone',
                response_url: '_RESPONSE_URL_',
            };

            var morbotron = {
                getMemeImageUrl: function (searchText, episode) {
                    expect(episode).equal('S01E07');
                    return Promise.resolve({
                        captionUrl: '_CAPTION_URL_',
                        imageUrl: '_IMAGE_URL_',
                    });
                },
            };

            var slack = {};
            var slackPromise = new Promise(function (resolve) {
                slack.respond = function (url, message) {
                    expect(message.attachments).ok;
                    expect(message.attachments.length).to.equal(1);
                    return resolve();
                };
            })

            var commands = new Commands(morbotron, slack);
            var commandPromise = commands.processCommand(params);

            return Promise.all([commandPromise, slackPromise]);

        });

        it('should succeed with slack response for `find <search text>`', function () {

            var params = {
                text: 'find checkmate',
                response_url: '_RESPONSE_URL_',
            };

            var morbotron = {
                findCaptions: function () {
                    return Promise.resolve({
                        searchUrl: '_SEARCH_URL_',
                        results: [
                            {
                                episode: 'S02E03',
                                episodeTitle: 'When Aliens Attack',
                                timestamp: 659910,
                                captionUrl: '_CAPTION_URL_',
                                thumbUrl: '_THUMB_URL_',
                                subtitles: 'THE REST OF THE DOMINOES WILL FALL LIKE A HOUSE OF CARDS.\nCHECKMATE.',
                            },
                            {
                                episode: 'S03E04',
                                episodeTitle: '_EPISODE_TITLE_',
                                timestamp: 12345,
                                captionUrl: '_ANOTHER_CAPTION_URL_',
                                thumbUrl: '_ANOTHER_THUMB_URL_',
                                subtitles: '_SUBTITLES_',
                            },
                        ]
                    });
                },
            };

            var slack = {};
            var slackPromise = new Promise(function (resolve) {
                slack.respond = function (url, message) {
                    expect(url).to.eq('_RESPONSE_URL_');
                    expect(message.response_type).to.equal('ephemeral');
                    expect(message.text).to.contain('_SEARCH_URL_');
                    expect(message.text).to.contain('checkmate');
                    expect(message.attachments).ok;
                    expect(message.attachments.length).to.equal(2);
                    expect(message.attachments[0].title).to.equal('S02E03 When Aliens Attack @ 659910');
                    expect(message.attachments[0].title_link).to.equal('_CAPTION_URL_');
                    expect(message.attachments[0].text).to.contain('DOMINOES');
                    expect(message.attachments[0].thumb_url).to.equal('_THUMB_URL_');
                    return resolve();
                };
            })

            var commands = new Commands(morbotron, slack);
            var commandPromise = commands.processCommand(params)
                .then(function (message) {
                    expect(message.text).to.contain('"checkmate"');
                });

            return Promise.all([commandPromise, slackPromise]);

        });

    });

});
