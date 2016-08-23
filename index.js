var AWS;
var qs = require('qs');
var Commands = require('./commands');
var morbotron = require('./morbotron');
var token;

var commands = new Commands(morbotron);

const kmsEncryptedToken = 'AQECAHgQgkf5FS+MdwrQzHaZikgLKo3iOHDmv/38KcoCalmIkQAAAHYwdAYJKoZIhvcNAQcGoGcwZQIBADBgBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDJhRw/N1/qR+Vsx5rwIBEIAz86ICuPp++XHkbYB+jeIlWWQuK2ojs9aLifdodVpnc04Vlk3beVbXesndjLDZLY21WNs5';


//exports.handler = function (event, context, cb) {
exports.handler = function (event, context) {
    if (token) {
        // Container reuse, simply process the event with the key in memory
        processEvent(event, context);
    } else if (kmsEncryptedToken && kmsEncryptedToken !== "<kmsEncryptedToken>") {
        var encryptedBuf = new Buffer(kmsEncryptedToken, 'base64');
        var cipherText = {CiphertextBlob: encryptedBuf};

        if (!AWS) {
            try {
                AWS = require('aws-sdk');
            } catch (err) {
                context.fail(err);
                return;
            }
        }
        var kms = new AWS.KMS();
        kms.decrypt(cipherText, function (err, data) {
            if (err) {
                console.log("Decrypt error: " + err);
                context.fail(err);
            } else {
                token = data.Plaintext.toString('ascii');
                processEvent(event, context);
            }
        });
    } else {
        context.fail("Token has not been set.");
        // return cb(new Error('no token'));
    }
};

var processEvent = function(event, context) {
    var body = event.body;
    var params = qs.parse(body);
    var requestToken = params.token;
    if (requestToken !== token) {
        console.error("Request token (" + requestToken + ") does not match expected");
        context.fail("Invalid request token");
    }

    commands.processCommand(params)
        .then(function (result) {
            context.succeed(result);
        }, function (err) {
            context.fail(err);
        });
        // return cb(null, {});
};
exports.processEvent = processEvent;
