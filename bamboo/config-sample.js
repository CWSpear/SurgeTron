// build with Bamboo!
// !build buildname 
// where buildname is one of the properties of bamboo.plans here

var bamboo = {
    plans: {
        // if the URL of where you manage your deployment is 
        // http://bamboo.example.com/browse/BANANA-DEPLOYMENT
        // then projectKey is BANANA and buildKey is DEPLOYMENT.
        // Username and Password of a user that has permission to build.
        // API is the API to your Bamboo instance API, i.e.
        // http://bamboo.example.com/rest/api/latest/ (NOTE ENDING SLASH)
        buildname: {
            projectKey: '',
            buildKey: '',
            username: '',
            password: '',
            api: ''
        }
    }
};

exports = module.exports = bamboo;