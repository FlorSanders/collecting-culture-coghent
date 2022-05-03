<template>
  <v-container>
    <div  class="background">
    <v-row class="text-center">
      <v-layout class="my-10" row wrap justify-center>
      <v-card style="max-width: 80%;">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Collecting culture
        </h1>

        <p class="subheading font-weight-regular">
         For more information about available culture in Ghent
          <br>discover our
          <a
            href="https://data.collectie.gent/"
            target="_blank"
            color="secondary"
          >online collection</a>
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Discover your favourite culture in Ghent.
        </h2>
      <p>
        This tool helps you guiding through the beautiful city of Ghent.
        Get inspired by choosing your culture of interest and find unique
        items in our musea and city. Be guided through the city center and
        see, taste, smell and discover art from around the globe.
      </p>
      </v-col>

      <v-col>
        <v-text-field class="mx-5" v-model="searchbox" outlined label="Search for culture" clearable />
        <v-col class="mb-3">
          <v-btn @click="search" elevation="2" color="secondary">Search</v-btn>
        </v-col>
        <iframe width="50%" height="10%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=3.6184501647949223%2C51.0033856925319%2C3.8340568542480473%2C51.09662294502995&amp;layer=mapnik" style="border: 1px solid black"></iframe>
        <br/>
        <small>
          <a href="https://www.openstreetmap.org/#map=13/51.0500/3.7263">View Larger Map</a>
        </small>
      </v-col>
      <v-layout v-if="debug" class="my-5" row wrap justify-center>
        <v-card
          class="elevation-0"
          color="rgb(0, 0, 0, 0)"
          >
        <v-card-title>{{this.debug}}</v-card-title>
        <v-card
          v-for="result in results"
          :key="result.id"
          width="70vh"
          class="my-2">
          <v-card-title>{{result.title}}</v-card-title>
        </v-card>
        </v-card>
      </v-layout>
      </v-card>
      </v-layout>
    </v-row>
    </div>
  </v-container>
</template>

<script>
  import axios from "axios"

  export default {
    name: 'SearchBox',

    data: () => ({
     searchbox: "",
     results: [
       {id: "1", title: "We love BDS"},
       {id: "2", title: "We adore BDS"},
       {id: "3", title: "We *** BDS"},

     ],
     debug: null,
    }),
    
    methods: {
      search() {
        this.debug = this.searchbox
        console.log(this.searchbox)
      }
    }
  }
</script>

<style scoped>
.background {
  background-image:
   url("https://stad.gent/sites/default/files/styles/gallery_full/public/media/images/CollectievandeGentenaar-Eventbrite1.png?itok=dLOo3xh7");
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