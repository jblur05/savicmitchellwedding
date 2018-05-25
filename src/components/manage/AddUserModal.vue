<template>
  <b-modal :active="isComponentModalActive" has-modal-card>
    <form action="">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Login</p>
            </header>
            <section class="modal-card-body">
                <b-field label="Name">
                    <b-input
                        v-model="name"
                        placeholder="Guest Name"
                        required>
                    </b-input>
                </b-field>

                <b-field label="Number Of Guests">
                    <b-input
                        v-model="numGuests"
                        type="number"
                        placeholder="2"
                        required>
                    </b-input>
                </b-field>
                <b-field label="Address">
                    <b-input
                        v-model="address"
                        placeholder="Address"
                        required>
                    </b-input>
                </b-field>
                <b-field label="City">
                    <b-input
                        v-model="city"
                        placeholder="City"
                        required>
                    </b-input>
                </b-field>
                <b-field label="State">
                    <b-select v-model="state" placeholder="Select a character" required>
                        <template v-for="state in this.$globalStatesList">
                            <option :key="state.name">{{ state.name }}</option>
                        </template>
                    </b-select>
                </b-field>
                <b-field label="Zip Code">
                    <b-input
                        v-model="zipCode"
                        placeholder="Address"
                        required>
                    </b-input>
                </b-field>
            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$emit('close-add-guest-modal')">Close</button>
                <button class="button is-primary" @click="submit(true)">Submit</button>
            </footer>
        </div>
    </form>
  </b-modal>
</template>
<script>
export default {
  props: ['isComponentModalActive'],
  data () {
    return {
      name: '',
      numGuests: 0,
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  },
  methods: {
    submit (submitForm) {
      if (submitForm) {
        this.$emit('add-new-guest', { name: this.name, numGuests: this.numGuests, address: this.address, city: this.city, state: this.state, zipCode: this.zipCode })
      }
      this.$emit('close-add-guest-modal')
    }
  }
}
</script>
