var config = require('./config');
var bot = require('../../bot/bot.js');
var irc = require('irc');
require('irc-colors').global();

var client = new irc.Client(config.server, config.botName, {
    channels: config.channels
});

var augmentText = function(text) {
    text = text.replace(/<strong[^>]*?>(.*?)<\/strong>/g, '$1'.irc.bold());
    text = text.replace(/<em[^>]*?>(.*?)<\/em>/g, '$1'.irc.italic());
    text = text.replace(/<a .*?href="(.*)".*?>(.*?)<\/a>/g, '$2 ($1)');
    text = text.replace(/<br ?\/?>/g, "\n");

    return text;
};

client.addListener('message', function(from, to, text, message) {
    var promise = bot.getCommandPromise(text);
    if(promise) {
        promise.then(function(message) {
            client.say(to == config.botName ? from : to, augmentText(message));
        });
    }
});