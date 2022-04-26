const sparql_api = require('../services/sparql-api')
const gent_sparql = require('../services/gent-sparql')

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

module.exports = {
    get,
    get_sparql
};