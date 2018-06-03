<template>
  <v-layout row justify-center>
      <v-btn color="error" dark @click.native.stop="isComponentModalActive=true">Add Guest</v-btn>
    <v-dialog v-model="isComponentModalActive" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">Add User</v-card-title>
          <v-container grid-list-md>
            <v-flex xs12 sm6 md4>
              <v-text-field
                label="Name"
                hint="Guest Family Name"
                persistent-hint
                required
                v-model="guestName">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field
                label="Address"
                hint="Address of Guest"
                persistent-hint
                required
                v-model="address">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field
                label="City"
                hint="City of Guest"
                persistent-hint
                required
                v-model="city">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-select
                :items="states"
                v-model="state"
                label="Select"
                data-vv-name="select"
                required
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field
                label="Zip Code"
                hint="Zip Code of Guest"
                persistent-hint
                required
                v-model="zipCode">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field
                label="Country"
                hint="Country of Guest"
                persistent-hint
                required
                v-model="country">
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field
                label="Number of Guests"
                hint="Number Guests"
                type="number"
                persistent-hint
                required
                v-model="numGuests">
              </v-text-field>
            </v-flex>
          </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat v-on:click="$emit('close-add-guest-modal')" class="primary--text">Cancel</v-btn>
          <v-btn flat v-on:click="submit(true)" class="primary--text">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
export default {
  data () {
    return {
      guestName: '',
      numGuests: 0,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      isComponentModalActive: false
    }
  },
  computed: {
    states () {
      console.log('bad')
      var value = []
      for (var state of this.$globalStatesList) {
        value.push(state.name)
      }

      return value
    }
  },
  methods: {
    submit (submitForm) {
      console.log('hello2')
      if (submitForm) {
        this.$emit('add-new-guest', { guestName: this.guestName, numGuests: this.numGuests, address: this.address, city: this.city, state: this.state, zipCode: this.zipCode, country: this.country })
      }
      this.isComponentModalActive = false
    }
  }
}
</script>
