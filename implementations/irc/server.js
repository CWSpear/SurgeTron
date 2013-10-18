var config = require('./config');
var bot = require('../../bot/bot.js');
var irc = require("irc");
require('irc-colors').global();

var client = new irc.Client(config.server, config.botName, {
    channels: config.channels
});

client.addListener("message", function(from, to, text, message) {
    var promise = bot.getCommandPromise(text);
    if(promise) {
        promise.then(function(message) {
            client.say(to == config.botName ? from : to, message);
        });
    }
});