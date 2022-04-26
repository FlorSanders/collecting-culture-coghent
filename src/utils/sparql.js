var SparqlParser = require('sparqljs').Parser;
var parser = new SparqlParser();
var parsedQuery = parser.parse(
    'PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/> ' + 
    'SELECT ?title  ?beschrijving FROM <http://stad.gent/ldes/dmg> ' + 
    'WHERE { ' +
    '?object cidoc:P102_has_title ?title. ' +
    'FILTER (regex(?title, "NOVA", "i")) ' +
    '?object cidoc:P3_has_note ?beschrijving ' +
    '} LIMIT 100 '
)

const test_query = 'PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/> ' + 
'SELECT ?title  ?beschrijving FROM <http://stad.gent/ldes/dmg> ' + 
'WHERE { ' +
'?object cidoc:P102_has_title ?title. ' +
'FILTER (regex(?title, "NOVA", "i")) ' +
'?object cidoc:P3_has_note ?beschrijving ' +
'} LIMIT 100 ';

exports.parsedQuery = parsedQuery;
exports.test_query = test_query;