const {
  FROM_COGHENT_GRAPHS,
  PREFIX_COGHENT,
  SPARQL_SOURCES,
} = require("./coghent-constants.js");
const { QueryEngine } = require("@comunica/query-sparql");
const engine = new QueryEngine();

/**
 * Find information on wikidata for a museum
 * @param {string} url - Wikidata url of the museum
 * @returns {object} Museum info
 */
const getMuseumInfo = async (url) => {
  try {
    const MUSEUM_INFO = `
        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>
        PREFIX laterms: <https://linked.art/ns/terms/>
        
        SELECT *
        WHERE {
          BIND(<${url}> AS ?museum)
          ?museum schema:description ?description.
          FILTER(lang(?description) = "nl")
          ?museum rdfs:label ?label.
          FILTER(lang(?label) = "nl")
          ?museum wdt:P18 ?image.
          ?museum wdt:P571 ?inception.
          ?museum wdt:P625 ?location.  
          ?museum wdt:P856 ?website.
          ?museum wdt:P6375 ?street_address.
        }
        
        LIMIT 1
      `;
    const museumInfoQuery = await engine.queryBindings(MUSEUM_INFO, {
      sources: [SPARQL_SOURCES.wikidata],
      logger: console.log,
    });
    const museaInfo = await museumInfoQuery.toArray();
    if (museaInfo && museaInfo.length) {
      const museumInfo = museaInfo[0];
      const museum = {
        id: url,
        label: museumInfo.get("label").value,
        description: museumInfo.get("description").value,
        website: museumInfo.get("website").value,
        image: museumInfo.get("image").value,
        address: museumInfo.get("street_address").value,
        inception: museumInfo.get("inception").value,
        location: museumInfo
          .get("location")
          .value.match(/^Point\(([0-9.]+)\s([0-9.]+)\)$/)
          .slice(1, 3)
          .map((coord) => parseFloat(coord)),
      };
      return museum;
    } else {
      throw new Error(`Museum ${url} not found`);
    }
  } catch ({ message }) {
    console.error(message);
    return;
  }
};

var musea = {}; // getMusea data cache - data should be pretty static
var musea = {
  "http://www.wikidata.org/entity/Q980285": {
    id: "http://www.wikidata.org/entity/Q980285",
    label: "STAM - Stadsmuseum Gent",
    description: "Museum in België",
    website: "https://stamgent.be/nl_be/over-het-stam/erfgoed-in-gent",
    image:
      "http://commons.wikimedia.org/wiki/Special:FilePath/Gent%20STAM%2012-10-2010%2010-33-23.JPG",
    address: "Godshuizenlaan 2",
    inception: "2010-01-01T00:00:00Z",
    location: [3.71722, 51.04361],
  },
  "http://www.wikidata.org/entity/Q1809071": {
    id: "http://www.wikidata.org/entity/Q1809071",
    label: "Design Museum Gent",
    description: "Museum in België",
    website: "https://www.designmuseumgent.be/",
    image:
      "http://commons.wikimedia.org/wiki/Special:FilePath/Jan%20Breydelstraat.jpg",
    address: "Jan Breydelstraat 5",
    inception: "1925-01-01T00:00:00Z",
    location: [3.720141, 51.055838],
  },
}; // Cached data - TODO: remove in production (queries itself are slow with lodi data source)

/**
 * Fetches the musea POI's and populates the 'musea' object.
 * Should be executed on server startup so the application knows where to look for objects.
 * @returns {object} Musea of the CoGhent Dataset
 */
const getMusea = async () => {
  if (Object.entries(musea).length) {
    // Object is already filled with entries
    return musea;
  } else {
    try {
      // Obtain wikidata links for the musea in the dataset
      const MUSEA_LINKS = `
          ${PREFIX_COGHENT}
          
          SELECT DISTINCT ?museum
          ${FROM_COGHENT_GRAPHS}
          
          WHERE {
            # Find the museum
            ?object cidoc:P50_has_current_keeper ?museum.
            FILTER(regex(str(?museum), "^http://www.wikidata.org/"))
          }
          
          LIMIT 10
        `;

      const museaLinksQuery = await engine.queryBindings(MUSEA_LINKS, {
        sources: [SPARQL_SOURCES.coghent],
      }); // TODO: Very slow if LIMIT > amount of results

      museaLinksQuery.on("error", (error) => {
        console.error(error);
        return;
      });

      const museaLinksData = await museaLinksQuery.toArray();

      await Promise.all(
        museaLinksData.map(async (data) => {
          try {
            // Obtain info from the musea from wikidata
            const museumURL = data.get("museum").value;
            const museum = getMuseumInfo(museumURL);
            musea[museumURL] = museum;
            return museum;
          } catch ({ message }) {
            console.error(message);
            return;
          }
        })
      );
      return musea;
    } catch ({ message }) {
      console.error(message);
      return;
    }
  }
};

/**
 * Find objects in de coghent catalog using the sparql endpoint
 * @param {object} options - Query options {museum, search, onlyKnownMakers, filterOnTitle, filterOnDescription, filterOnLocation, limit}
 * @returns {array} - Array of objects fitting the requirements
 */
const findCoghentObjects = async (options) => {
  try {
    // Destructure options
    const {
      museum,
      search,
      onlyKnownMakers,
      filterOnTitle,
      filterOnDescription,
      filterOnLocation,
      limit,
    } = options;
    // Obtain museum id
    let museumId = museum;
    if (typeof museum === "object") {
      museumId = museum.id;
    }
    // Find objects in the musea
    const OBJECT_INFO = `
        ${PREFIX_COGHENT}
        SELECT *
        ${FROM_COGHENT_GRAPHS}
        WHERE {
          # Find any object that has a label
          ${search ? `BIND("${search}" as ?search)` : ""}
          ${museum ? `BIND(<${museum}> as ?museum)` : ""}
          # Find corresponding image
          ?object rdf:type cidoc:E22_Man-Made_Object.
          # Find the museum
          ?object cidoc:P50_has_current_keeper ?museum.
          # Find image
          OPTIONAL {
            ?object cidoc:P129i_is_subject_of ?image.
          }
          # Get the label in dutch
          ?object cidoc:P102_has_title ?object_title.
          FILTER(lang(?object_title) = "nl")
          # Get the description in dutch
          ?object cidoc:P3_has_note ?object_description
          FILTER(lang(?object_description) = "nl")
          # Obtain the production
          ?object cidoc:P108i_was_produced_by ?production.
          # Location of production
          OPTIONAL {
            ?production cidoc:P7_took_place_at ?place.
            ?place laterms:equivalent ?location.
            ?location skos:prefLabel ?production_location.
          }
          # Get the maker
          OPTIONAL {
            ?production cidoc:P14_carried_out_by ?producer.
            ?producer laterms:equivalent ?maker.
            ?maker rdfs:label ?maker_name.
          }
          # Filter on search term
          FILTER(
            true
            ${onlyKnownMakers ? `&& str(?maker_name) != "onbekend"` : ""}
            ${
              filterOnTitle || filterOnDescription || filterOnLocation
                ? `&& (
              ${filterOnTitle ? `regex(?object_title, ?search, "i") ||` : ""}
              ${
                filterOnDescription
                  ? `regex(?object_description, ?search, "i") ||`
                  : ""
              }
              ${
                filterOnLocation
                  ? `regex(?production_location, ?search, "i") ||`
                  : ""
              }
              false
            )`
                : ""
            }
          )
        }
        LIMIT ${limit || 10}
      `;
    const objectInfoQuery = await engine.queryBindings(OBJECT_INFO, {
      sources: [SPARQL_SOURCES.coghent],
    });
    objectInfoQuery.on("data", (data) => {
      console.log("new triple");
    });
    objectInfoQuery.on("error", (error) => {
      console.error(error);
      return;
    });
    const objectInfoData = await objectInfoQuery.toArray();
    const objectInfo = objectInfoData.map((data) => {
      const object = {
        title: data.get("object_title").value,
      };
      return object;
    });

    console.log(objectInfo);
    return objectInfo;
  } catch ({ message }) {
    console.error(message);
  }
};

module.exports = {
  getMuseumInfo,
  getMusea,
  findCoghentObjects,
};
