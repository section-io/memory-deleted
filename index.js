var AWS;
var qs = require('qs');
var Commands = require('./commands');
var morbotron = require('./morbotron');
var token;

var commands = new Commands(morbotron);

const kmsEncryptedToken = 'AQECAHgQgkf5FS+MdwrQzHaZikgLKo3iOHDmv/38KcoCalmIkQAAAHYwdAYJKoZIhvcNAQcGoGcwZQIBADBgBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDJhRw/N1/qR+Vsx5rwIBEIAz86ICuPp++XHkbYB+jeIlWWQuK2ojs9aLifdodVpnc04Vlk3beVbXesndjLDZLY21WNs5';

exports.handler = function (event, context, callback) {
    if (token) {
        // Container reuse, simply process the event with the key in memory
        processEvent(event, callback);
    } else if (kmsEncryptedToken && kmsEncryptedToken !== "<kmsEncryptedToken>") {
        var encryptedBuf = new Buffer(kmsEncryptedToken, 'base64');
        var cipherText = {CiphertextBlob: encryptedBuf};

        if (!AWS) {
            try {
                AWS = require('aws-sdk');
            } catch (err) {
                return callback(err);
            }
        }
        var kms = new AWS.KMS();
        kms.decrypt(cipherText, function (err, data) {
            if (err) {
                return callback(new Error('Decrypt error:' + err));
            } else {
                token = data.Plaintext.toString('ascii');
                return processEvent(event, callback);
            }
        });
    } else {
        return callback(new Error('Token has not been set.'));
    }
};

var processEvent = function(event, callback) {
    var body = event.body;
    var params = qs.parse(body);
    var requestToken = params.token;
    if (requestToken !== token) {
        console.error("Request token (" + requestToken + ") does not match expected");
        return callback(new Error('Invalid request token'));
    }

    commands.processCommand(params)
        .then(function (result) {
            return callback(null, result);
        }, function (err) {
            return callback(err);
        });
};
exports.processEvent = processEvent;
