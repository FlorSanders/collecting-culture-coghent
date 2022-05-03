const express = require("express");
const router = express.Router();
const BDSController = require("../controllers/BDS.controller");

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
 *         description: A list of POI's. IMPORTANT! -photo- will not be part of the JSON object if no photo is found. Also, only if typePOI = -MUSEA-, will there be a property called -objects- containing the art objects.
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
 *                       photo:
 *                         type: string
 *                         description: URL of a picture of the POI.
 *                         example: https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECx7h3tskxFTbgQqs2C8eFzQSy26unq5TLiuWITSzkv14bD-dmNkQNCsrC6yeagcqNiRhRdvHyXP2vjCgoNyqjdgyMJSwO4h6CLRdZNOKOF-E0GlDvJ7l0G52C2Nan0vbAa7LF7nj7Pvej-vg-XRajUk2DHG77Jo9__Riypt_kAJYCa&key=AIzaSyAZjaVJSVc5Kho17T5Eq6q3N6pkFs_zbpg
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
 *                       objects:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: The ID of the art object.
 *                               example: hva:2002-078-852
 *                             type:
 *                               type: string
 *                               description: The type of the art object.
 *                               example: asset
 *                             title:
 *                               type: string
 *                               description: The title of the art object.
 *                               example: Affiche voor Cirque Pauwels
 *                             description:
 *                               type: string
 *                               description: The description of the art object.
 *                               example: Affiche voor Cirque Pauwels. Donkerblauwe achtergrond, witte randen. Gekleurde tekeningen, een lachend clownshoofd en twee steigerende circuspaarden. Tekst, Cirque Pauwels. Le nouveau Cirque de France.
 *                             image:
 *                               type: string
 *                               description: The URL of the image of the art object.
 *                               example: https://api.collectie.gent/iiif/imageiiif/3/d7b1996e3e4c622c6eeda23150dc4909-2002-078-852.tif/full/%5E1000,/0/default.jpg
 */
router.get("/poi/:country", BDSController.get_poi);

module.exports = router;
