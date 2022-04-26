const https = require('https')

const API_URL = 'apidg.gent.be'

const sparql_api_test = () => {
    return new Promise((resolve, reject) => {
        var options_test = {
            hostname: API_URL,
            path: '/opendata/adlib2eventstream/v1/',
            method: 'GET',
        };

        https.request(options_test, function(res) {
            console.log('STATUS: ' + res.statusCode);
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                resolve(JSON.parse(body));
            });
        }).end();
    });
};

exports.sparql_api_test = sparql_api_test;
