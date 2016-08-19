'use strict';

var expect = require('chai').expect;

var index = require('../index');

describe('index', function () {

    describe('handler', function () {

        var anEvent = {
            "body": "token=FLOOP&user_name=fry&command=morbotron&channel_name=general&text=good%20news%20everyone"
        };

        function createExpectFailContext(done) {
            return {
                fail: function () {
                    done();
                },
                success: function () {
                    done(new Error('unexpected success'))
                }
            };
        }

        it('should need a token', function (done) {

            index.handler(anEvent, createExpectFailContext(done));

        });

    });

    describe('getMemeImageUrl', function () {

        var resultPromise = index.getMemeImageUrl('good news everyone')

        it('should have an imageUrl', function () {

            return resultPromise.then(function (result) {
                expect(result.imageUrl).match(/^https:\/\/morbotron\.com\/meme\/S\d{2}E\d{2}\/\d+\.jpg\?b64lines=.+/);
            });

        });

        it('should have an captionUrl', function () {

            return resultPromise.then(function (result) {
                expect(result.captionUrl).match(/^https:\/\/morbotron\.com\/caption\/S\d{2}E\d{2}\/\d+$/);
            });

        });

    });

});
