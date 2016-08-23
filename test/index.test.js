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

});
