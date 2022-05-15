const https = require("https");

const API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const API_KEY = "AIzaSyAZjaVJSVc5Kho17T5Eq6q3N6pkFs_zbpg";

const normalise_input = (input) => input.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

const countries = ['algerije', 'amerika', 'australie', 'belgie', 'brazilie', 'bulgarije', 'canada', 'china', 'denemarken', 'duitsland', 'egypte', 'engeland', 'finland', 'frankrijk', 'griekenland', 'hongarije', 'ierland', 'india', 'italie', 'japan', 'luxemburg', 'marokko', 'nederland', 'noorwegen', 'oostenrijk', 'polen', 'portugal', 'roemenie', 'rusland', 'schotland', 'spanje', 'tunesie', 'turkije', 'zweden', 'zwitserland']
const adjectives = ['algerijnse', 'amerikaanse', 'australische', 'belgische', 'braziliaanse', 'bulgaarse', 'canadese', 'chinese', 'deense', 'duitse', 'egyptische', 'engelse', 'finse', 'franse', 'griekse', 'hongaarse', 'ierse', 'indische', 'italiaanse', 'japanse', 'luxemburgse', 'marokkaanse', 'nederlandse', 'noorse', 'oostenrijkse', 'poolse', 'portugese', 'roemeense', 'russische', 'schotse', 'spaanse', 'tunesische', 'turkse', 'zweedse', 'zwitserse']

const get_locations = (search, type = "restaurant", limit = 3) => {
  return new Promise((resolve, reject) => {
    index = countries.indexOf(normalise_input(search.toLowerCase()))
    if (index > -1) {
      search_full = adjectives[index] + " " + type
    } else {
      search_full = search + " " + type
    }

    let url = `${API_URL}` +
    `?keyword=${search_full}` +
    `&location=51.052110,3.724955` +
    `&radius=10000` +
    `&key=${API_KEY}`;

    https
      .get(url, (response) => {
        console.log("STATUS: " + response.statusCode);
        console.log("MESSAGE: " + response.statusMessage);
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          let places = JSON.parse(body);
          let locations = places.results;
          if (locations.length > 5) {
            locations = locations.slice(0, limit);
          }
          resolve(locations);
        });
      })
      .on("error", () => {
        console.log("error occured");
      });
  });
};

exports.get_locations = get_locations;
