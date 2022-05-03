const sparql_api = require('../services/sparql-api')
const gent_sparql = require('../services/gent-sparql')
const locations = require('../services/locations')
const locations_coghent = require('../services/coghent-poi')

async function get(req, res, next) {
    try {
        var result = await sparql_api.sparql_api_test();
        console.log(result["Datasetcatalogus.titel"]["@value"])
        res.json(result)
    } catch(e) {
        console.log("GET ERROR");
        next(e);
    }
}

async function get_sparql(req, res, next) {
    try {
        var result = await gent_sparql.sparql_test();
        res.end(result)
    } catch(e) {
        console.log("POST ERROR");
        next(e);
    }
}

async function get_poi(req, res, next) {
    try {
        var country = req.params['country'];
        var result = await locations.get_locations(country);
        return_value = {'points': []}
        result.forEach(element => {
            let dict = {}
            dict["name"] = element.name;
            dict["Xco"] = element.geometry.location.lat;
            dict["Yco"] = element.geometry.location.lng;
            dict["icon"] = element.icon;
            dict["types"] = element.types;
            return_value["points"].push(dict)
        });
        return_value = JSON.stringify(return_value)
        res.end(return_value)
    } catch(e) {
        console.log("POI ERROR");
        next(e);
    }
}

async function get_poi_coghent(req, res, next) {
    try {
        var country = req.params['country'];
        var result = await locations_coghent.getCoghentPOIs(country);
        return_value = JSON.stringify(result)
        res.end(return_value)
    } catch(e) {
        console.log("POI ERROR");
        next(e);
    }
}

module.exports = {
    get,
    get_sparql,
    get_poi,
    get_poi_coghent
};