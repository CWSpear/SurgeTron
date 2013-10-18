var Q = require('Q');
var request = require('request');
var util = require('util');

var helper = {
    // helper to log an obj
    log: function(obj, depth) {
        console.log(util.inspect(obj, { colors:true, depth: depth || 2 }));
    },

    promisize: function(message) {
        var deferred = Q.defer();
        deferred.resolve(message);
        return deferred.promise;
    },

    // i.e. 
    // var obj = { 
    //   message: 'test', 
    //   one: [
    //     { 
    //       two: [
    //         'dummy', 
    //         { 
    //           three: 'ultitest' 
    //         }
    //       ] 
    //     }
    //   ] 
    // }
    // // returns "ultitest"
    // accessByString(obj, 'one[0].two[1].three'); 
    // 
    // from http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
    accessByString: function(obj, str) {
        str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        str = str.replace(/^\./, '');           // strip a leading dot
        var ary = str.split('.');
        while (ary.length) {
            var part = ary.shift();
            if (part in obj) {
                obj = obj[part];
            } else {
                return; // undefined
            }
        }
        return obj;
    },

    // simple helper function to quickly query a URL
    // property can be a string representation of the property you want to access:
    // i.e. 'one[0].two[1].three' (see accessByString comment)
    promiseUrl: function(url, property, prefix, postfix) {
        var deferred = Q.defer();

        request({ url: url, json: true }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // if(typeof body == 'string') body = JSON.parse(body);
                var result = property === null ? body : helper.accessByString(body, property);
                result = (prefix || '') + result + (postfix || ''); 
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    }   
};

exports = module.exports = helper;