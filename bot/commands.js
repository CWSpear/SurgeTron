var _ = require('underscore');
var Q = require('q');
var request = require('request');
var util = require('util');
var bamboo = require('../bamboo/config.js');
var helper = require('./helper.js');

// and now the commands
// the key is the command word used to trigger.
// i.e. !help triggers commands.help.message()
// 
// messages can return a string, or a function.
// that function can return a promise whose first
// argument when resolved is a string, or it can
// return a string directly
// 
// some HTML is allowed
// 
// you can pass in parameters if message is a function
// (see hammertime2 as an example)
// 
// if a keywords property exists, it will search the entire
// message for that work and trigger the message if one of
// those keywords were found (first command matched wins).
// keywords are matched against the following (where
// "text" is the body of the last message sent):
// _.uniq(text.toLowerCase().replace(/[^a-z0-9 ]+/g, '').split(' '))
// 
// the "note" property is what's printed in the !help command
// 
// author is so you know who made it! 
// (doesn't show in anywhere while running)
var commands = {
    help: {
        message: function() {
            var ts = [
                '<strong>List of commands:</strong>',
                '<em>Trigger a command with !commandName or if the command has keywords associated with it, just say one of those words anywhere in your message to trigger the command.</em>',
                ''
            ];
            _.each(commands, function(command, commandName) {
                var str = '<strong>' + commandName + '</strong>' + ': ' + command.note;
                if(command.keywords) str += ' (keywords: [' + command.keywords.join(', ') + '])';
                ts.push(str);
            });

            ts.push('<br>Please contribute commands on <a href="https://github.com/CWSpear/SurgeTron/">GitHub</a>');

            return ts.join('<br>');
        },
        note: "Outputs help message.",
        author: 'CWSpear'
    },
    hammertime: {
        message: '━━▊ ━━▊ ━━▊',
        note: "It's Hammer Time!",
        author: 'CWSpear'
    },
    // !hammertime2 Cameron Spear
    // name1 will be "Cameron", name2 will be "Spear"
    hammertime2: {
        message: function(name1, name2) {
            return name1 + ' ━━▊ ━━▊ ━━▊ ' + name2;
        },
        note: "It's <em>really</em> Hammer Time! (2 params)",
        author: 'CWSpear'
    },
    // could bring this back if you could sanitize it to be safe! haha
    // eval: {
    //     message: function() {
    //         var args = Array.prototype.slice.call(arguments);
    //         return eval(args.join(' '));
    //     },
    //     note: "Eval is evil!",
    //     author: 'CWSpear'
    // },
    dirty: {
        keywords: ['hard', 'fast', 'quick', 'force'],
        message: "That's what she said!",
        note: "That's what she said!",
        author: 'CWSpear'        
    },
    build: {
        message: function(planName) {
            planName = (planName + '').toLowerCase();

            // contact CWSpear to add plans
            var plans = bamboo.plans;

            var action = 'queue';

            if(!(plan = plans[planName])) return '<strong>' + planName + '</strong> is not a valid plan (plans must be preconfigured)';

            var url = plan.api + action + '/' + [plan.projectKey, plan.buildKey].join('-');
            var deferred = Q.defer();

            var r = request.post({
                url: url,
                json: true,
                qs: {
                    os_authType: 'basic'
                },
                auth: {
                    user: plan.username,
                    pass: plan.password,
                    sendImmediately: true
                }
            }, function(error, response, result) {
                if (!error && response.statusCode == 200) {
                    deferred.resolve([result.planKey, '#' + result.buildNumber, 'passed.', result.triggerReason, 'by <em>me</em>.'].join(' '));
                } else {
                    deferred.resolve('[' + response.statusCode + '] There was an error!');
                }
            });

            return deferred.promise;
        },
        note: "Perform a build on Bamboo (must be preconfigured)",
        author: 'CWSpear'
    },
    test: {
        // keywords: ['test'],
        message: "Test <em>this!</em>",
        note: "Need something to test?",
        author: 'CWSpear'        
    },
    weather: {
        message: function() {
            var args = Array.prototype.slice.call(arguments);
            var arg = args.join(' ');
            return helper.promiseUrl('http://api.openweathermap.org/data/2.5/weather?q=' + arg, 'weather[0].description');
        },
        note: "Find out the weather in a city, state (i.e. pass in Spokane, WA).",
        author: 'CWSpear'
    },
    excuse: {
        message: function() {
            return helper.promiseUrl('http://clintorion.com/cgi-bin/excuses.py', 'message');
        },
        note: "Outputs an excuse that a developer might use.",
        author: 'CWSpear'
    },
    calc: {
        message: function() {
            var args = Array.prototype.slice.call(arguments);
            var str = args.join(' ');
            var arg = encodeURIComponent(str);
            return helper.promiseUrl('http://www.calcatraz.com/calculator/api?c=' + arg, null, str + ' = ');
        },
        note: 'Performs arbitrary numerical calculations.',
        author: 'JFrancis'
    },
    kill: {
        message: "I'm sorry, I'm afraid I can't do that. It contradicts the First Law of Robotics.",
        note: 'Perform a killing blow.',
        author: 'CWSpear'
    }
};

module.exports = commands;
