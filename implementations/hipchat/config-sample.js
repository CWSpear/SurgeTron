// get named passed in, i.e. passed_in_room would be "Surge Consulting Group"
// if you ran `node index hipchat "Surge Consulting Group"`
var passed_in_room = process.argv[3];

var config = {
    // config (get details from https://www.hipchat.com/account/xmpp)
    // (used for listening)

    // your user's ID (gottem from URL above while signed into your account)
    jid: "USER_ID_GOES_HERE@chat.hipchat.com",

    // password for your account
    password: "YOUR_PASSWORD",

    // nickname that you'll be known by while listening
    room_nick: "YOUR_NAME",
     
    // use HipChat's web API for posting messages
    hipchat_apikey: "HIPCHAT_API_KEY",
    hipchat_defaults: {
        room: passed_in_room || 'DEFAULT_ROOM',

        // customize these as you like
        from: 'SurgeTron',
        color: 'gray',
        notify: false
    }
};

// choose room to listen to.
// ROOM_NAME must be the exact name of the room (used for HipChat API)
// i.e. if the name of the room is "Surge Consulting Group", that is the ROOM_NAME
switch(config.hipchat_defaults.room) {
    // set up different rooms to jump in (ROOM_ID is from link above)
    case 'ROOM_NAME': config.room_jid = "ROOM_ID@conf.hipchat.com"; break;
    case 'ROOM_NAME': config.room_jid = "ROOM_ID@conf.hipchat.com"; break;
    case 'ROOM_NAME': config.room_jid = "ROOM_ID@conf.hipchat.com"; break;
    default: console.log('Invalid Room: ' + config.hipchat_defaults.room); process.exit(1);
}

exports = module.exports = config;