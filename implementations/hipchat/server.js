var sys = require('sys');
var util = require('util');
var xmpp = require('node-xmpp');
var Q = require('q');
var _ = require('lodash');
var HipChatClient = require('node-hipchat');

var bot = require('../../bot/bot.js');

module.exports = function(config){
    var hipchat = new HipChatClient(config.hipchat_apikey);
    
    var cl = new xmpp.Client({
        jid: config.jid + '/bot',
        password: config.password
    });
     
    // Log all data received
    //cl.on('data', function(d) {
    //    util.log("[data in] " + d);
    //});
     
    // Once connected, set available presence and join room
    cl.on('online', function() {
        // util.log("We're online!");
     
        // set ourselves as online
        cl.send(new xmpp.Element('presence', { type: 'available' }).
            c('show').t('chat')
         );
        
        // join room (and request no chat history)
        cl.send(new xmpp.Element('presence', { to: config.room_jid+'/'+config.room_nick }).
            c('x', { xmlns: 'http://jabber.org/protocol/muc' })
        );
    
        // send keepalive data or server will disconnect us after 150s of inactivity
        setInterval(function() {
            cl.send(new xmpp.Message({}));
        }, 2 * 60 * 1000);
    
        // recommended, but doesn't seem to work...
        // cl.connection.socket.setTimeout(0);
        // cl.connection.socket.setKeepAlive(true, 2 * 60 * 1000);
    });
    
    cl.on('stanza', function(stanza) {
        // always log error stanzas
        if (stanza.attrs.type == 'error') {
            // console.log(util.inspect(stanza, { colors:true, depth:null }));
            // try {
            //     if(stanza.getChild('error').attrs['type'] != 'cancel')
            //         util.log('[error] ' + stanza);
            // } catch(e) {
            //     util.log('[error] ' + stanza);
            // }
            return;
        }
    
        // ignore everything that isn't a room message
        if (!stanza.is('message') || stanza.attrs.type != 'groupchat') {
            // util.log('[info] Not a room message.');
            return;
        }
     
        var body = stanza.getChild('body');
        // message without body is probably a topic change
        if (!body) {
            // util.log('[info] No body');
            return;
        }
    
        var text = body.getText();
    
        var from = stanza.attrs.from.replace(config.room_jid + '/', '');
        // util.log('[info] (' + from + ') ' + text);
    
        if(from == 'SurgeTron') {
            // util.log('[info] skip message from bot');
            return;
        }
    
        // bot magic
        var promise = bot.getCommandPromise(text);
        if(promise) {
            promise.then(function(message) {
                var params = _.defaults({ message: message }, config.hipchat_defaults);
                hipchat.postMessage(params);
            });
        }
    });
}

