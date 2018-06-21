<template>
  <v-carousel height="100%">
    <v-carousel-item
      v-for="imageIndex in 6"
      :key="imageIndex"
      :src="getSrc(imageIndex)"
      srcset="srcSmall"
      transition="fade"
      reverse-transition="fade"
    ></v-carousel-item>
  </v-carousel>
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
      items: [
        {
          src: '/static/imgs/desk/eng1.jpg',
          srcSmall: '/static/imgs/desk/eng1.jpg',
          srcMedium: '/static/imgs/desk/eng1.jpg',
          srcLarge: '/static/imgs/desk/eng1.jpg'
        },
        {
          src: '/static/imgs/desk/eng3.jpg',
          srcSmall: '/static/tr:w-500/imgs/eng3.jpg',
          srcMedium: '/static/tr:w-800/imgs/desk/eng3.jpg',
          srcLarge: '/static/tr:w-1024/imgs/desk/eng3.jpg'
        },
        {
          src: '/static/imgs/eng8.jpg',
          srcSmall: '/static/imgs/tr:w-500/eng8.jpg'
        },
        {
          src: '/static/imgs/eng5.jpg',
          srcSmall: '/static/imgs/tr:w-500/eng5.jpg'
        },
        {
          src: '/static/imgs/eng6.jpg',
          srcSmall: '/static/imgs/tr:w-500/eng6.jpg'
        },
        {
          src: '/static/imgs/eng7.jpg',
          srcSmall: '/static/imgs/tr:w-500/eng7.jpg'
        },
        {
          src: '/static/imgs/eng2.jpg',
          srcSmall: '/static/imgs/tr:w-500/eng2.jpg'
        },
        {
          src: '/static/imgs/eng0.jpg',
          srcSmall: '/static/imgs/tr:w-500/eng0.jpg'
        }
      ]
    }
  }
}
</script>

<style lang="stylus">
  #example-custom-transition
    .fade
      &-enter-active, &-leave-active, &-leave-to
        transition: .3s ease-out
        position: absolute
        top: 0
        left: 0

      &-enter, &-leave, &-leave-to
        opacity: 0
</style>
