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
                <v-btn elevation="2" color="secondary" type="submit"
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
                <v-card-title>{{ this.searchTerm }}</v-card-title>
                <v-card
                  v-for="result in results"
                  :key="result.name"
                  width="70vw"
                  class="my-2"
                >
                  <v-card-title>{{ result.name }}</v-card-title>
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

    map: null,
  }),

  methods: {
    async search() {
      this.searchTerm = this.searchbox;
      let response = await axios.get(
        `http://localhost:3001/bds/poi/${this.searchbox}`
      );

      this.results = response.data.points;
      console.log(this.results);

      this.results.forEach(element => {
        let icon = L.icon({
          iconUrl: element.icon,
          iconSize: [38, 95],
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
