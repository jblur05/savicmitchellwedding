<template>
  <div class="frame">
    <div class="carousel-view">
      <transition class='carousel' name="carouseltrans" mode="out-in">
          <img class="eng-img" :src="visibleImageURL" :key="visibleImage"/>
      </transition>
      <!-- <div class='carousel-controls'>
        <button class='carousel-controls__button' @click="previous">prev</button>
        <button class='carousel-controls__button' @click="next">next</button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      numPics: 9,
      visibleImage: 0,
      slideFilePrefix: 'eng',
      slideFilePostfix: 'jpg',
      interval: undefined
    }
  },
  computed: {
    visibleImageURL: function () {
      return '/static/' + this.slideFilePrefix + this.visibleImage + '.' + this.slideFilePostfix
    }
  },
  methods: {
    next () {
      this.visibleImage = (this.visibleImage + 1) === this.numPics ? 0 : this.visibleImage + 1
    },
    previous () {
      this.visibleImage = (this.visibleImage - 1) < 0 ? this.numPics - 1 : this.visibleImage - 1
    }
  },
  created: function () {
    const self = this
    this.interval = setInterval(function () {
      self.next()
    }, 16000)
  },
  beforeDestroy () {
    console.log('beforeDestroy')
    clearInterval(this.interval)
  }
}
</script>

<style>
.carouseltrans-enter-active, .carouseltrans-leave-active {
  transition: all 2s;
}

.carouseltrans-enter, .carouseltrans-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.carousel-controls {
  position: absolute;
}

.carousel-view {
  overflow: hidden;
  max-width: var(--carousel-img-max-width);
  max-height: var(--carousel-img-max-height);
}

.frame {
    margin: auto;
    background-color: white;
    min-width: var(--carousel-frame-min-width);
    min-height: var(--carousel-frame-min-height);
    padding: var(--carousel-frame-padding);
}

@media screen and (min-width: 800px) {

}
</style>
