<template>
  <v-app id="app">
    <v-navigation-drawer app class="wedding-pink lighten-3" v-model="isOpen" mobile-break-point="100000px">
      <v-list dense class="pt-0">
        <v-list-tile v-for="item in links" :key="'mobile' + item.display" :to="item.link">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.display }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      </v-navigation-drawer>
      <v-content class="main-content">
        <v-card flat class="transparent" v-if="isMobile">
          <v-toolbar-side-icon absolute @click.stop="isOpen = !isOpen"></v-toolbar-side-icon>
        </v-card>
        <v-container >
           <v-layout justify-center>
              <h1 class="display-3 tangerine-font-bold">Happily Ever After</h1>
           </v-layout>
           <v-layout justify-center>
            <v-card flat class="transparent" v-if="!isMobile">
              <template v-for="item in links">
                  <v-btn flat :to="item.link" :key="'main' + item.display">{{ item.display }}</v-btn>
                  <!-- <v-btn flat to="/manage">manage</v-btn> -->
                </template>
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
  name: 'App',
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  mounted () {
    window.addEventListener('resize', this.handleWindowResize)
  },
  data () {
    return {
      isOpen: false,
      links: [
        {
          display: 'Home',
          link: '/'
        },
        {
          display: 'Details',
          link: 'details'
        },
        {
          display: 'Engagements',
          link: 'engagements'
        },
        {
          display: 'Registry',
          link: 'registry'
        },
        {
          display: 'RSVP',
          link: 'rsvp'
        }
      ]
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.isMobile
    }
  },
  methods: {
    handleWindowResize (event) {
      this.$store.commit('SET_WINDOW_SIZE', event.currentTarget.innerWidth)
    }
  }
}
</script>
