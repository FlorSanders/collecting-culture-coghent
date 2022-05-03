<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="CoGent logo"
          class="shrink mt-1"
          contain
          min-width="100"
          src="https://images.squarespace-cdn.com/content/v1/5fb4f5b0509a072b93557287/1605696771742-W0ITSYRAQ1RSW9V4INY7/Logo_CollectievandeGentenaar.png?format=1500w"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://www.collectie.gent/"
        target="_blank"
        text
      >
        <span class="mr-2">Explore COGENT</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>
