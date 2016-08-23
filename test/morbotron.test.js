'use strict';

var expect = require('chai').expect;

var morbotron = require('../morbotron');

describe('morbotron', function () {

    this.timeout(5000);

    describe('getMemeImageUrl', function () {

        describe('find "good news everyone"', function () {

            it('should have an imageUrl', function () {

                var result = morbotron.getMemeImageUrl('good news everyone');
                return result.then(function (result) {
                    expect(result.imageUrl).match(/^https:\/\/morbotron\.com\/meme\/S\d{2}E\d{2}\/\d+\.jpg\?b64lines=.+/);
                });

            });

            it('should have an captionUrl', function () {

                var result = morbotron.getMemeImageUrl('good news everyone');
                return result.then(function (result) {
                    expect(result.captionUrl).match(/^https:\/\/morbotron\.com\/caption\/S\d{2}E\d{2}\/\d+$/);
                });

            });

        });

        describe('find nothing', function () {

            it('should reject promise', function () {
                var result = morbotron.getMemeImageUrl('kjfkhduerureujskjshlkjekurruruzqxcq');
                return result.then(function () {
                    return Promise.reject();
                }, function (err) {
                    return Promise.resolve();
                });
            });

        });

    });

    describe('findCaptions', function () {

        describe('find "good news everyone"', function () {

            it('should have maximum results', function () {

                var result = morbotron.findCaptions('good news everyone');
                return result.then(function (result) {
                    expect(result.searchUrl).match(/^https:\/\/morbotron\.com\/\?q=.+/);
                    expect(result.results).ok;
                    expect(result.results.length).equal(5);
                    expect(result.results[0].episode).match(/^S\d{2}E\d{2}$/);
                    expect(result.results[0].timestamp).a('number');
                    expect(result.results[0].captionUrl).match(/^https:\/\/morbotron\.com\/caption\/S\d{2}E\d{2}\/\d+$/);
                    expect(result.results[0].thumbUrl).match(/^https:\/\/morbotron\.com\/img\/S\d{2}E\d{2}\/\d+\/small\.jpg$/);
                    expect(result.results[0].subtitle).ok;
                });

            });

        });

    });

});
