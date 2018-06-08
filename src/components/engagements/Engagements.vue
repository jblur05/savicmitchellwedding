<template>
  <v-carousel>
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      :src="item.src"
      transition="fade"
      reverse-transition="fade"
    ></v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          src: '/static/eng1.jpg'
        },
        {
          src: '/static/eng3.jpg'
        },
        {
          src: '/static/eng8.jpg'
        },
        {
          src: '/static/eng5.jpg'
        },
        {
          src: '/static/eng6.jpg'
        },
        {
          src: '/static/eng7.jpg'
        },
        {
          src: '/static/eng2.jpg'
        },
        {
          src: '/static/eng0.jpg'
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
