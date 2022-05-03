const {
  MUSEA_HC,
  GRAPHQL_SOURCE,
  GRAPHQL_QUERY,
} = require("./coghent-constants.js");
const { GraphQLClient, gql } = require("graphql-request");
const client = new GraphQLClient(GRAPHQL_SOURCE);

/**
 * Construct variables object for the graphql query
 * @param {string} museum - Museum id, one of [ 'hva', 'stam', 'im', 'dmg' ]
 * @param {string} keyword - Search term
 * @param {int} limit - Query limit parameter
 * @returns {object} - Options parameter
 */
const getVariables = (museum, keyword, limit = 5) => {
  if (!Object.keys(MUSEA_HC).includes(museum)) {
    console.error(`Unknown museum ${museum}`);
  }

  return {
    limit: limit,
    searchValue: {
      has_mediafile: true,
      isAsc: false,
      key: "title",
      randomize: false,
      relation_filter: [MUSEA_HC[museum].id],
      seed: `${Math.random()}`,
      skip_relations: false,
      value: keyword,
    },
    skip: 0,
  };
};

/**
 * Search for objects for the specified museum and search term combination
 * @param {string} museumId - Museum id, one of [ 'hva', 'stam', 'im', 'dmg' ]
 * @param {string} keyword - Search term
 * @param {int} limit - Maximum amount of returned objects (default 5)
 * @returns {array} - List of max 5 objects {id, type, title, description, image}
 */
const getMuseumObjects = async (museumId, keyword, limit = 5) => {
  try {
    const data = await client.request(
      GRAPHQL_QUERY,
      getVariables(museumId, keyword, limit)
    );
    const { Entities } = data;
    const { results } = Entities;
    const objects = results.map((result) => {
      const { object_id, type, title, description, primary_mediafile } = result;

      const object = {
        id: object_id,
        type,
        title: title[0].value,
        description: description[0].value,
        image: `https://api.collectie.gent/iiif/imageiiif/3/${primary_mediafile}/full/%5E1000,/0/default.jpg`,
      };

      return object;
    });

    return objects;
  } catch ({ message }) {
    console.error(message);
  }
};

module.exports = {
  getMuseumObjects,
};
