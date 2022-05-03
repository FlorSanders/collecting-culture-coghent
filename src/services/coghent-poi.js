const { getMuseumInfo } = require("./coghent-sparql-queries.js");
const { getMuseumObjects } = require("./coghent-graphql-queries.js");
const { MUSEA_HC } = require("./coghent-constants.js");

/**
 * Find musea POIs and objects for a given country using the sparql endpoint
 * @param {string} country - Country / keyword which should be searched for
 * @param {int} limit - Maximum amount of objects per POI (default 5)
 * @returns {array} Array of musea with objects related to the specified country
 */
const getCoghentPOIs = async (country, limit = 5) => {
  try {
    const POIs = await Promise.all(
      Object.entries(MUSEA_HC).map(async ([museumId, museum]) => {
        try {
          const { url } = museum;
          const museumInfo = await getMuseumInfo(url);
          const museumObjects = await getMuseumObjects(
            museumId,
            country,
            limit
          );

          const POI = {
            ...museumInfo,
            objects: museumObjects,
          };

          return POI;
        } catch ({ message }) {
          console.error(message);
        }
      })
    );

    return POIs.filter((POI) => POI.objects && POI.objects.length);
  } catch ({ message }) {
    console.error(message);
  }
};

module.exports = {
  getCoghentPOIs,
};