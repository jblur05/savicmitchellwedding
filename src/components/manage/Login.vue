<template>
    <v-layout row wrap>
        <v-flex sm3 class="mx-auto" >
              <v-card>
                <v-flex grey lighten-2 >
                  <v-card>
                    <v-card>
                      <p class="title tangerine-font-bold">Login</p>
                    </v-card>
                    <v-card>
                    <v-form ref="managelogin" v-model="valid" lazy-validation>
                      <v-text-field
                        v-model="username"
                        label="username"
                        required ></v-text-field>
                      <v-text-field
                        v-model="password"
                        label="password"
                        type="password"
                        required></v-text-field>
                       <!-- <v-alert :value="rsvpRequestFailure" outline color="error" >
                        Unable to Login
                       </v-alert> -->
                       <v-spacer></v-spacer>
                      <v-btn @click="login" white>Submit</v-btn>
                    </v-form>
                  </v-card>
                  </v-card>
                </v-flex>
              </v-card>
          </v-flex>
    </v-layout>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      username: undefined,
      password: undefined
    }
  },
  methods: {
    login () {
      if (this.$refs.managelogin.validate()) {
        let self = this
        this.$store.dispatch('obtainToken', { 'username': this.username, 'password': this.password })
          .then(response => {
            self.$emit('loggedIn')
          })
      }
    }
  }
}
</script>
