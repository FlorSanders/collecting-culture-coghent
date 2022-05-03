const https = require('https')

const API_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
const API_KEY = 'AIzaSyAZjaVJSVc5Kho17T5Eq6q3N6pkFs_zbpg'

const get_locations = (search) => {
    return new Promise((resolve, reject) => {
        let search_full = `${search} restaurant in Ghent`
        let url = `${API_URL}?query=${search_full}&key=${API_KEY}`
        https.get(url, (response) => {
            console.log('STATUS: ' + response.statusCode);
            console.log('MESSAGE: ' + response.statusMessage);
            let body = '';
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                let places = JSON.parse(body);
                const locations = places.results;
                resolve(locations);
            });
          }).on('error', () => {
            console.log('error occured');
          })
    });
};

exports.get_locations = get_locations;