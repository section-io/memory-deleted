'use strict';

var expect = require('chai').expect;

var index = require('../index');

describe('index', function () {

    this.timeout(5000);

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

    describe('processEvent', function () {

        it('should', function (done) {

            var event = {
                "body": "text=go%20good%20news%20everyone"
            };
            var context = {
                succeed: function (message) {
                    expect(message.response_type).to.equal('in_channel');
                    expect(message.attachments).ok;
                    expect(message.attachments.length).to.equal(1);
                    expect(message.attachments[0].title).ok;
                    expect(message.attachments[0].title_link).ok;
                    expect(message.attachments[0].image_url).ok;
                    done();
                },
                fail: function (err) {
                    done(err);
                },
            };
            index.processEvent(event, context);

        });

    });

});
