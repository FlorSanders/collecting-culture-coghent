<template>
  <v-container>
    <div class="background">
      <v-row class="text-center">
        <v-layout class="my-10" row wrap justify-center>
          <v-card style="max-width: 80%">
            <v-col class="mb-4">
              <h1 class="display-2 font-weight-bold mb-3">
                Collecting culture
              </h1>

              <p class="subheading font-weight-regular">
                For more information about available culture in Ghent
                <br />discover our
                <a
                  href="https://data.collectie.gent/"
                  target="_blank"
                  color="secondary"
                  >online collection</a
                >
              </p>
            </v-col>

            <v-col class="mb-5" cols="12">
              <h2 class="headline font-weight-bold mb-3">
                Discover your favourite culture in Ghent.
              </h2>
              <p>
                This tool helps you guiding through the beautiful city of Ghent.
                Get inspired by choosing your culture of interest and find
                unique items in our musea and city. Be guided through the city
                center and see, taste, smell and discover art from around the
                globe.
              </p>
            </v-col>

            <!-- Search box -->
            <v-col>
              <form class="form-inline" @submit.prevent="search">
                <v-text-field
                  class="mx-5"
                  v-model="searchbox"
                  outlined
                  label="Search for culture"
                  clearable
                />
                <v-btn elevation="2" color="secondary" type="submit" v-on:keyup.enter="search"
                  >Search</v-btn
                >
              </form>
            </v-col>

            <!-- Map -->
            <v-col>
              <div id="mapContainer" style="width:100%;height:500px"></div>
            </v-col>

            <!-- Search results -->
            <v-layout v-if="searchTerm" class="my-5" row wrap justify-center>
              <v-card class="elevation-0" color="rgb(0, 0, 0, 0)">
                <v-card-title align="center">Results for "{{ this.searchTerm }}" in Ghent</v-card-title>
                <div v-if="results.length==0" align="center">
                  <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                </div>
                
                <v-card
                  v-for="result in results"
                  :key="result.name"
                  width="70vw"
                  class="my-2"
                >
                  <v-card-title>{{ result.name }}</v-card-title>
                  
                  <v-card-subtitle v-if="result.typePOI=='MUSEA'" align="left">Cogent official museum</v-card-subtitle>
                  <v-card-subtitle v-else align="left">
                   <v-row class="ml-1 mb-1">
                      <v-rating
                        :value="result.rating"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="14"
                      ></v-rating>
                      <div class="grey--text ms-4">
                        ({{ result.user_ratings_total ? result.user_ratings_total : 0}})
                      </div>
                      <v-spacer></v-spacer>
                      <div class="grey--text ms-4 mr-1">
                        {{result.vicinity}}
                      </div>
                   </v-row>
                  </v-card-subtitle>

                  <v-img
                    v-if="result.photo"
                    height="250"
                    :src="result.photo"
                  />

                  <div v-if="result.objects">
                    <v-expansion-panels focusable>
                      <v-expansion-panel
                        v-for="object in result.objects"
                        :key="object.id">
                        <v-expansion-panel-header>{{ object.title}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div align="center">
                            <v-img
                              v-if="object.image"
                              width="50%"
                              :src="object.image"
                              class="mt-3 mb-3"
                            />
                          </div>
                          <v-text>{{ object.description}}</v-text>
                          </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                  
                </v-card>
              </v-card>
            </v-layout>
          </v-card>
        </v-layout>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import axios from "axios";
export default {
  name: "SearchBox",

  data: () => ({
    searchbox: "",
    results: [],
    searchTerm: null,
    cogentlogo: "https://images.squarespace-cdn.com/content/v1/5fb4f5b0509a072b93557287/1605696771742-W0ITSYRAQ1RSW9V4INY7/Logo_CollectievandeGentenaar.png?format=1500w",

    map: null,
  }),

  methods: {
    async search() {
      this.results = []
      this.searchTerm = this.searchbox;
      let response = await axios.get(
        `http://localhost:3001/bds/poi/${this.searchbox}`
      );

      this.results = response.data.points;

      this.results.forEach(element => {
        let icon = L.icon({
          iconUrl: element.icon,
          iconSize: [40, 40],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
        });

        let marker = L.marker([element.lat, element.lng], {icon: icon}).addTo(this.map);
        marker.bindPopup(element.name);
      });
    },

    setupLeafletMap: function () {
      const mapDiv = L.map("mapContainer").setView([51.052110, 3.724955], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapDiv);

      this.map = mapDiv;
    },
  },
  mounted() {
    this.setupLeafletMap();
  },
};
</script>

<style scoped>
.background {
  background-image: url("https://stad.gent/sites/default/files/styles/gallery_full/public/media/images/CollectievandeGentenaar-Eventbrite1.png?itok=dLOo3xh7");
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  position: absolute;
  overflow: scroll;
  height: 100%;
  width: 100%;
  left: 0px;
  top: 0px;
}
</style>
