const locations = require("../services/locations");
const locations_coghent = require("../services/coghent-poi");

const API_KEY = "AIzaSyAZjaVJSVc5Kho17T5Eq6q3N6pkFs_zbpg";

async function get_poi(req, res, next) {
  try {
    var country = req.params["country"];
    let culture_points = [];
    let commercial_points = [];

    var result_coghent = await locations_coghent.getCoghentPOIs(country);
    result_coghent.forEach((element) => {
      let dict = {};
      dict["name"] = element.label;
      dict["lat"] = element.location[1];
      dict["lng"] = element.location[0];
      dict["photo"] = element.image;
      dict["icon"] =
        "https://maps.gstatic.com/mapfiles/place_api/icons/v2/museum_pinlet.png";
      dict["typePOI"] = "MUSEA";
      dict["objects"] = element.objects;
      culture_points.push({ item: dict, sort: element.objects.length });
    });

    var result_resto = await locations.get_locations(country);
    for (const element of result_resto) {
      let dict = {};
      if ("photos" in element) {
        dict["photo"] =
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
          element.photos[0].photo_reference +
          "&key=" +
          API_KEY;
      }
      dict["name"] = element.name;
      dict["lat"] = element.geometry.location.lat;
      dict["lng"] = element.geometry.location.lng;
      dict["icon"] = element.icon;
      dict["types"] = element.types;
      dict["rating"] = element.rating;
      dict["user_ratings_total"] = element.user_ratings_total; 
      dict["vicinity"] = element.vicinity;
      commercial_points.push({ item: dict, sort: element.user_ratings_total });
    }

    var result_store = await locations.get_locations(country, (type = "store"));
    for (const element of result_store) {
      let dict = {};
      if ("photos" in element) {
        dict["photo"] =
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
          element.photos[0].photo_reference +
          "&key=" +
          API_KEY;
      }
      dict["name"] = element.name;
      dict["lat"] = element.geometry.location.lat;
      dict["lng"] = element.geometry.location.lng;
      dict["icon"] = element.icon;
      dict["types"] = element.types;
      dict["rating"] = element.rating;
      dict["user_ratings_total"] = element.user_ratings_total; 
      dict["vicinity"] = element.vicinity;
      commercial_points.push({ item: dict, sort: element.user_ratings_total });
    }

    const zip = (a, b) => Array(Math.max(b.length, a.length)).fill().map((_,i) => [a[i], b[i]].filter(x => x !== undefined)).flat();

    let return_points = zip(
      culture_points
        .sort((a, b) => b.sort - a.sort)
        .map(value => value.item),
      commercial_points
        .sort((a, b) => b.sort - a.sort)
        .map(value => value.item)
    )

    return_value = JSON.stringify({ points: return_points });
    res.end(return_value);
  } catch (e) {
    console.log("POI ERROR");
    next(e);
  }
}

module.exports = {
  get_poi,
};
