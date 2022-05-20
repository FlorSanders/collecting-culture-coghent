# BDS project: Collecting culture

:elevator: elevator pitch:
> We present to you Collecting Culture: a dynamic guided sightseeing tour, tailored to your cultural interests.
> The Culture Tour app takes you on a trip through Ghent, visiting some of Ghent's most iconic historical locations,
> each of which is annotated with its relevance to your cultural interests & linked to relevant historical objects that can be found in Ghent's musea.

:bar_chart:	pitch deck:

https://TODO/

:film_projector: video demo:

- How to use: https://TODO/
- Feature overview: https://TODO/

## Project setup
```bash
# install npm dependencies
> npm install

# start frontend and backend server
> npm run dev
```

## Project structure

### Frontend
Collecting culture uses a Vue frontend in combination with Vuetify. The source code for the single page website can be found in `client > src > views > Home.vue`.

Frontend features include:
* **Search feature** for finding local business and art related to the entered keyword. Press the 'Search'-button or simply press enter on your keyboard.
* **OpenStreetMap** integration with the points of interest related to the entered keyword, focussed on Ghent. Appropriate icons display the resulting point of interests together with its name.
* **List of results** (loading icon while searching) with results from the CoGent linked open data dataset en Google Places API alternating. Only the top 5 places are listed.
* **Dropdown** with detailed information (description and image) about the found art result.
* **Responsive design**: smartphone, tablet and computer compatible.
* Minor features: address description of local businesses, 5-star reviews, number of reviews, link to CoGent website, etc. 

### Backend
Collecting culture backend can be found in the `src` folder of the repository. Both the CoGent linked open data dataset as well as the Google Places API are used to collect data and culture.

## Datasets and APIs

- [CoGent linked open data dataset](https://www.collections.gent/) - via data.collectie.gent graphql API
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/search-nearby)
