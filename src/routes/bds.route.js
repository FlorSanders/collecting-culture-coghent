const express = require('express');
const router = express.Router();
const BDSController = require('../controllers/BDS.controller');


router.get('/', BDSController.get);
router.get('/gent', BDSController.get_sparql);

/**
 * @swagger
 * /poi/{country}:
 *   get:
 *     summary: Retrieve a list of points of interests from a specific country
 *     description: Once a country is given, some points of interests are returned from which a route can be created.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         description: The country for which the POI's must be returned.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of POI's.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 points:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the POI.
 *                         example: Aleegro Moderato
 *                       typePOI:
 *                         type: array
 *                         description: Types of the POI.
 *                         example: ["restaurant", "bar", "store"]
 *                       icon:
 *                         type: string
 *                         description: URL of the icon of POI.
 *                         example: https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png
 *                       Xco:
 *                         type: float
 *                         description: The X-coördinate of the location.
 *                         example: 51.05533
 *                       Yco:
 *                         type: float
 *                         description: The Y-coördinate of the location.
 *                         example: 3.72020
*/
router.get('/poi/:country', BDSController.get_poi);

/**
 * @swagger
 * /poi_coghent/{country}:
 *   get:
*/
router.get('/poi_coghent/:country', BDSController.get_poi_coghent);

module.exports = router;