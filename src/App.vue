<template>
  <v-app id="app">
      <v-content class="main-content">
        <v-container >
           <v-layout justify-center>
              <h1 class="display-3 tangerine-font-bold">Happily Ever After</h1>
           </v-layout>
           <v-layout justify-center>
              <v-card flat class="transparent">
                  <v-btn flat to="/">Home</v-btn>
                  <v-btn flat>Details</v-btn>
                  <v-btn flat to="/rsvp">RSVP</v-btn>
                  <v-btn flat>Engagements</v-btn>
                  <v-btn flat to="/manage">manage</v-btn>
              </v-card>
          </v-layout>
        </v-container>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
