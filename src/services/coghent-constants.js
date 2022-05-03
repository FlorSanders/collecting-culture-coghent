const { GraphQLClient, gql } = require("graphql-request");

/* SPARQL RELATED CONSTANTS */

const FROM_COGHENT_GRAPHS = `
FROM <http://stad.gent/ldes/personen> 
FROM <http://stad.gent/ldes/thesaurus>
FROM <http://stad.gent/ldes/industriemuseum>
FROM <http://stad.gent/ldes/archief>
FROM <http://stad.gent/ldes/dmg>
FROM <http://stad.gent/ldes/hva>
FROM <http://stad.gent/ldes/stam>
`;

const PREFIX_COGHENT = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX laterms: <https://linked.art/ns/terms/>
`;

const SPARQL_SOURCES = {
  // coghent: {
  //   type: "sparql",
  //   value: "https://stad.gent/sparql",
  // }, // Still does not work
  coghent: "https://lodi.ilabt.imec.be/sparql/gent",
  wikidata: { type: "sparql", value: "https://query.wikidata.org/sparql" },
};

/* GRAPHQL RELATED CONSTANTS */

const MUSEA_HC = {
  hva: {
    label: "Huis Van Alijn",
    id: "entities/94c0a4e6-0511-473b-939a-93c5fa989d9a",
    url: "http://www.wikidata.org/entity/Q2358158",
  },
  stam: {
    label: "Stadsmuseum Gent",
    id: "entities/f65f1cf0-5fc3-4dd4-a190-60b4166ce8df",
    url: "http://www.wikidata.org/entity/Q980285",
  },
  im: {
    label: "Industriemuseum",
    id: "entities/07670944-3244-4132-8b3d-0a57cf67c8d6",
    url: "http://www.wikidata.org/entity/Q2245203",
  },
  dmg: {
    label: "Design Museum Gent",
    id: "entities/116a59ef-fb84-412f-9631-4653eb0e5264",
    url: "http://www.wikidata.org/entity/Q1809071",
  },
  // archief: {
  //   id: "entities/358c1bdc-bcd7-45ab-8b93-e2cd85d21aca",
  // }, // Archief is not really a POI
}; // Harcoded collection of musea

const GRAPHQL_SOURCE = "https://data.collectie.gent/api/graphql";

const GRAPHQL_QUERY = gql`
  query getEntities($limit: Int, $skip: Int, $searchValue: SearchFilter!) {
    Entities(limit: $limit, skip: $skip, searchValue: $searchValue) {
      count
      limit
      results {
        ...minimalEntity
        __typename
      }
      relations {
        ...fullRelation
        __typename
      }
      __typename
    }
  }
  fragment minimalEntity on Entity {
    id
    object_id
    type
    title: metadata(key: [title]) {
      key
      value
      __typename
    }
    description: metadata(key: [description]) {
      key
      value
      __typename
    }
    primary_mediafile
    primary_transcode
    primary_mediafile_info {
      width
      height
      __typename
    }
    __typename
  }
  fragment fullRelation on Relation {
    key
    type
    label
    value
    order
    __typename
  }
`;

module.exports = {
  FROM_COGHENT_GRAPHS,
  PREFIX_COGHENT,
  SPARQL_SOURCES,
  MUSEA_HC,
  GRAPHQL_SOURCE,
  GRAPHQL_QUERY,
};
