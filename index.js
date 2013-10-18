var util = require('util');

if(process.argv.length < 3) {
    console.log('Invalid number of params.');
    console.log('node index implementation [params...]');
    process.exit(1);
}

try {
    require('./implementations/' + process.argv[2] + '/server.js');
} catch(e) {
    if(e.code === 'MODULE_NOT_FOUND')
        console.log('Invalid implementation: ' + process.argv[2]);
    else
        console.error(e);
    process.exit(1);
}
