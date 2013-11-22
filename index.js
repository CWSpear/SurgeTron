#!/usr/bin/env node --harmony-generators

var fs = require('fs');
var program = require('commander');
var prompt = require('co-prompt');
var co = require('co');


program
    .version('0.9.0')
    .option('-i, --instance <name>', 'choose an instance for the given implementation')
    .usage('[options] <implementation or command>');

program
    .command('*')
    .description('run with the given implementation')
    .action(function (implementation, options) { 
        var path = './implementations/' + implementation + '/server.js';
        if (fs.existsSync(path)) require(path);
        else {
            console.log('');
            console.log('  Could not find "' + implementation + '" implementation');
            console.log('  Use `list` command for supported implementations');
            console.log('');
        }
    });

program
    .command('list')
    .description('list supported implementations')
    .action(function () {
        // TODO: make this prettier and dynamic
        console.log('');
        console.log('  hipchat, irc');
        console.log('');
    });

program
    .command('config')
    .description('run the config wizard')
    .action(function () {
        var config = {};
        co(function *() {
            var doHipChat = yield prompt.confirm('Configure HipChat (y/N)? ');

            if(doHipChat) {
                config.hipchat = {
                    jid: yield prompt('  HipChat Jabber ID (jid): '),
                    password: yield prompt.password('  Password: '),
                    room_nick: yield prompt('  Nickname: '),
                     
                    hipchat_apikey: yield prompt('  HipChat API Key: '),
                    hipchat_defaults: {
                        room: yield prompt('  Default room: '),

                        from: yield prompt('  Bot\'s name: '),
                        color: yield prompt('  Bot\'s color: '),
                        notify: yield prompt.confirm('  Should Notify (y/N)? ')
                    }
                };
            }
        })(function () {
            console.log(config);
            process.exit(0);
        });
    });

program.parse(process.argv);

if (!program.args.length) program.help();