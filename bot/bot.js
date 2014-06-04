var helper = require('./helper.js');
var commands = require('./commands.js');
var _ = require('lodash');
var util = require('util');

var triggeredCommand = function(text) {
    var params = text.slice(1).split(' ');
    var command = params.shift();

    if(!commands[command] || !commands[command].message) return false;

    params = _.map(params, function(param) {
        return param.replace(/<[^>]+>/ig, '');
    });

    var message = typeof commands[command].message === 'function' ? commands[command].message.apply(this, params) : commands[command].message;
    return typeof message.then == 'function' ? message : helper.promisize(message);
};

var searchForKeywords = function(text) {
    var parts = _.uniq(text.toLowerCase().replace(/[^a-z0-9 ]+/g, '').split(' '));
    var theCommand = false;

    // use every so we can break out once we have a match
    _.every(commands, function(command, key) {
        if(!command.keywords || theCommand) return true; // continue

        var match = _.any(command.keywords, function(keyword) {
            return _.contains(parts, keyword);
        });

        if(match) {
            var message = typeof commands[key].message === 'function' ? commands[key].message() : commands[key].message;
            theCommand = typeof message.then == 'function' ? message : helper.promisize(message);
            return false; // break
        }
    });

    return theCommand;
};

var bot = {
    getCommandPromise: function(text) {
        if(text.indexOf('!') === 0) return triggeredCommand(text);
        else return searchForKeywords(text);
    }
};

exports = module.exports = bot;