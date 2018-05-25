<template>
  <div id="app">
    <nav class="navbar has-shadow">
        <div class="navbar-brand">
            <p class="navbar-item title tangerine-font-bold">Savic-Mitchell Wedding</p>
            <p class="navbar-item subtitle tangerine-font-regular">August 18 2018</p>
        </div>
        <div class="navbar-end">
            <div class="navbar-item">
                <div class="field is-grouped">
                    <!-- <p class="control">
                        <a class="button">About</a>
                    </p>
                    <p class="control">
                        <a class="button">RSVP</a>
                    </p>
                    <p class="control">
                        <a class="button">Pictures</a>
                    </p> -->
                </div>
            </div>
        </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
