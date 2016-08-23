var AWS;
var qs = require('qs');
var morbotron = require('./morbotron');
var token;

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

    var user = params.user_name;
    var command = params.command;
    var channel = params.channel_name;
    var commandText = params.text;

    var match = /^go +(.+)$/.exec(commandText);
    if (!match) {
        context.fail("Unknown command");
    } else {
        var searchText = match[1];
        morbotron.getMemeImageUrl(searchText)
            .then((result) => {
                // TODO respond via response_url to bypass 3-second timeout https://api.slack.com/slash-commands#responding_to_a_command
                context.succeed({
                    response_type: 'in_channel',
                    attachments: [
                        // https://api.slack.com/docs/message-attachments
                        {
                            title: searchText,
                            title_link: result.captionUrl,
                            image_url: result.imageUrl,
                        }
                    ]
                });
                // return cb(null, {});
            })
            .catch((err) => {
                console.error(err);
            });
    }
};
exports.processEvent = processEvent;
