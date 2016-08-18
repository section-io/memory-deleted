'use strict';

var index = require('./index');

var event = {
    body: 'token=FLOOP',
};

var context = {
    fail: function () {
        console.error('context.fail:', arguments);
    },
    succeed: function () {
        console.log('context.succeed:', arguments);
    }
};

var cb = function (err, message) {
    if (err) {
        console.error('cb:err:', err);
        return;
    }
    console.log('cb:message:', message);
};

index.handler(event, context, cb);
