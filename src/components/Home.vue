<template>
    <v-jumbotron
        :gradient="gradient"
        height="500px"
        :src="getSrc(6)"
        dark>
        <v-container class="home-text-container" fill-height>
          <v-layout align-center >
            <v-flex text-xs-center>
              <div class="wedding-title-text tangerine-font-bold">Savic-Mitchell Wedding</div>
              <div class="wedding-date-text">Saturday, August 18, 2018</div>
            </v-flex>
          </v-layout>
        </v-container>
    </v-jumbotron>
</template>

<script>

export default {
  methods: {
    getSrc (index) {
      let windowSize = this.$store.state.windowSize
      let imgSize = (windowSize <= 480 ? 480
        : windowSize <= 640 ? 640
          : windowSize <= 768 ? 768
            : windowSize <= 1024 ? 1024
              : 1150)
      return '/static/imgs/' + imgSize + '/' + index + '.JPG'
    }
  },
  data () {
    return {
      gradient: 'to top right, rgba(0, 0, 0, .1), rgba(20, 20, 20, .5)'
    }
  },
  name: 'Home'
}
</script>

<style type="text/css">
.home-text-container {
    padding-top: 200px;
}

.wedding-title-text {
    font-size: 4em;
}

.wedding-date-text {
    font-size: 1.4em;
}
</style>
