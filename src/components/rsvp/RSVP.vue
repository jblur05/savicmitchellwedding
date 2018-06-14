<template>
<v-container grid-list-md text-xs-center >
  <v-layout row wrap v-if="curRsvp.isValid && curGuest">
    <v-flex xs12 sm3 >
        <v-card class="grey lighten-2">
          <v-card sm3>
            <p class="display-2 tangerine-font-bold">{{ curGuest.name.charAt(0).toUpperCase() + curGuest.name.slice(1) }}</p>
          </v-card>
            <v-flex class="grey lighten-2">
              <v-card>
                <p>Number of Reserved Seats: {{ curGuest.familymember.length }}</p>
                <p v-if="seatsNeeded > 0">Guests Attending: {{ seatsNeeded }}</p>
                <p v-else>Not Attending</p>
                <p v-if="curGuest.rsvp">RSVP Recieved: {{ new Date(curGuest.rsvp).toLocaleDateString() }}</p>
                <v-btn @click.stop="submitRSVP" white>Submit</v-btn>
                <v-btn @click.stop="logout" white>logout</v-btn>
              </v-card>
            </v-flex>
        </v-card>
      <v-flex>
        <v-card m2 v-if="rsvpSubmitFailure !== undefined">
          <v-alert :value="!rsvpSubmitFailure" outline color="success">
            Successfully Submitted RSVP
          </v-alert>
          <v-alert :value="rsvpSubmitFailure" outline color="success">
            Successfully Submitted RSVP
          </v-alert>
        </v-card>
      </v-flex>
    </v-flex>
    <v-flex xs12 sm8>
        <v-card>
            <p class="display-2 tangerine-font-bold">Menu Selection</p>
            <template v-for="(item, index) in curGuest.familymember">
              <v-flex class="grey lighten-3" :key="item + index">
                <v-card :key="item.name">
                  <span class="body-2">Guest {{ (index + 1) }}</span>
                  <v-radio-group :row="windowSize > 850 ? true : false" v-model="item.food_choice">
                    <v-radio
                      v-for="option in foodChoices"
                      :key="item.name + option.label"
                      :label="`${option.label}`"
                      :value="option.model"
                    ></v-radio>
                  </v-radio-group>
                </v-card>
              </v-flex>
            </template>
        </v-card>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex >
      <v-card transparent>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <p class="title tangerine-font-bold" xs10 offset-xs1>Find Your RSVP</p>
        <v-form ref="rsvpFindForm" v-model="valid" lazy-validation>
          <v-text-field
            v-model="curRsvp.name"
            label="Last Name"
            :rules="nameRules"
            required></v-text-field>
          <v-text-field
            v-model="curRsvp.url"
            label="RSVP Code"
            :rules="urlRules"
            required></v-text-field>
           <v-alert :value="rsvpRequestFailure" outline color="error" >
            Unable to find RSVP
           </v-alert>
           <v-spacer></v-spacer>
          <v-btn @click="findGuest" white>Submit</v-btn>
        </v-form>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card transparent>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
// import axios from 'axios'

export default {
  created () {
    if (!this.curGuest && this.$route.params.guestURL) {
      this.$store.dispatch('setRSVPURL', this.$route.params.guestURL)
    }
  },
  data () {
    return {
      radio: '',
      valid: true,
      foodChoices: [
        {
          label: 'Chicken',
          model: 'Chicken'
        },
        {
          label: 'Ravioli',
          model: 'Ravioli'
        },
        {
          label: 'Child',
          model: 'Child'
        },
        {
          label: 'Not Attending',
          model: 'Not Needed'
        }
      ],
      // form validation rules
      nameRules: [
        v => !!v || 'Name is required'
      ],
      urlRules: [
        v => !!v || 'URL is required'
      ]
    }
  },
  computed: {
    windowSize () {
      return this.$store.state.windowSize
    },
    seatsNeeded () {
      var seats = 0
      if (this.curGuest) {
        for (var member of this.curGuest.familymember) {
          if (member.food_choice !== 'Not Needed') {
            seats++
          }
        }
      }
      return seats
    },
    isValid () {
      return this.$store.state.curRsvp.isValid
    },
    curRsvp () {
      return this.$store.state.curRsvp
    },
    rsvpRequestFailure () {
      return this.$store.state.rsvpRequestFailure
    },
    rsvpSubmitFailure () {
      return this.$store.state.rsvpSubmitFailure
    },
    curGuest () {
      var guest = this.$store.state.currentGuest
      if (guest) {
        for (var member of guest.familymember) {
          if (!member.food_choice) {
            member.food_choice = self.foodChoices[0]
          }
        }
      }

      console.info(this.$store.state.currentGuest)
      return guest
    },
    rsvpDate () {
      if (this.curGuest) {
        return this.curGuest.rsvp
      }
      return undefined
    }
  },
  methods: {
    submitRSVP () {
      if (this.curGuest) {
        let willAttend = this.seatsNeeded > 0
        this.$store.dispatch('submitRSVP', willAttend)
      }
    },
    logout () {
      if (this.curGuest) {
        this.$store.dispatch('logoutRSVP')
      }
    },
    findGuest () {
      if (this.$refs.rsvpFindForm.validate()) {
        this.$store.dispatch('getGuest')
      }
    }
  }
}
</script>
