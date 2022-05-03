const https = require('https')

const API_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
const API_URL_PHOTO = 'https://maps.googleapis.com/maps/api/place/photo?'
const API_KEY = 'AIzaSyAZjaVJSVc5Kho17T5Eq6q3N6pkFs_zbpg'

const get_locations = (search, type='restaurant', limit=3) => {
    return new Promise((resolve, reject) => {
        let search_full = `${search} ${type}`
        let url = `${API_URL}?location=51.05340993563812%23.727066260452398&query=${search_full}&radius=20000&key=${API_KEY}`
        https.get(url, (response) => {
            console.log('STATUS: ' + response.statusCode);
            console.log('MESSAGE: ' + response.statusMessage);
            let body = '';
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                let places = JSON.parse(body);
                let locations = places.results;
                if (locations.length > 5) {
                    locations = locations.slice(0,limit)
                }
                resolve(locations);
            });
          }).on('error', () => {
            console.log('error occured');
          })
    });
};


exports.get_locations = get_locations;