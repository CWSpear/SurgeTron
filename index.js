var util = require('util');

module.exports = function(botType, config) {
    try {
        require('./implementations/' + botType + '/server.js')(config);
    } catch(e) {
        if(e.code === 'MODULE_NOT_FOUND')
            console.log('Invalid implementation: ' + process.argv[2]);
        else
            console.error(e);
    }    
}


