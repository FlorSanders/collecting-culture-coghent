const https = require('https')
var FormData = require('form-data')

const API_URL = 'stad.gent'
var sparqldata = require('../utils/sparql')

const sparql_test = () => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(sparqldata.parsedQuery);

        var data_form = new FormData();
        const query = sparqldata.test_query
        data_form.append('query', query);

        var options_test = {
            hostname: API_URL,
            path: '/sparql',
            method: 'POST',
            headers: data_form.getHeaders()
        };

        const req = https.request(options_test, function(res) {
            console.log('STATUS: ' + res.statusCode);
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                resolve(body);
            });
        });
        req.on('error', error => {
            console.error(error);
        });

        data_form.pipe(req);
    });
};

exports.sparql_test = sparql_test;