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
        <v-card m2 v-if="!submissionValid">
          <v-alert :value=true outline color="error">
            Please Correct the RSVP Form then Click Submit
          </v-alert>
        </v-card>
        <v-card m2 v-if="rsvpSubmitFailure !== undefined">
          <v-alert :value="!rsvpSubmitFailure" outline color="success">
            Successfully Submitted RSVP
          </v-alert>
          <v-alert :value="rsvpSubmitFailure" outline color="error">
            Failed To Submit RSVP Call 801-721-1916
          </v-alert>
        </v-card>
      </v-flex>
    </v-flex>
    <v-flex xs12 sm8>
        <v-card>
            <p class="display-2 tangerine-font-bold">Menu Selection</p>
            <v-form ref="rsvpSubmissionForm" lazy-validation>
              <template v-for="(item, index) in curGuest.familymember">
                <v-flex class="grey lighten-3" :key="index + 'guest_'">
                  <v-card>
                    <!-- <span class="body-2">Guest {{ (index + 1) }}</span> -->
                    <v-text-field
                      v-model="item.name"
                      label="First Name"
                      :rules="[value => validateName(item)]"
                      :key="'guest_name_' + index"
                      required
                    ></v-text-field>
                    <v-radio-group :row="windowSize > 850 ? true : false" v-model="item.food_choice">
                      <v-radio
                        v-for="option in foodChoices"
                        :label="`${option.label}`"
                        :value="option.model"
                        :key="'guest_food_' + option.label"
                      ></v-radio>
                    </v-radio-group>
                  </v-card>
                </v-flex>
              </template>
          </v-form>
        </v-card>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex sm3 class="mx-auto" >
          <v-card>
            <v-flex grey lighten-2 >
              <v-card>
                <v-card>
                  <p class="title tangerine-font-bold">Find Your RSVP</p>
                </v-card>
                <v-card>
                <v-form ref="rsvpFindForm" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="curRsvp.name"
                    label="Last Name"
                    required ></v-text-field>
                  <v-text-field
                    v-model="curRsvp.url"
                    label="RSVP Code"
                    required></v-text-field>
                   <v-alert :value="rsvpRequestFailure" outline color="error" >
                    Unable to find RSVP
                   </v-alert>
                   <v-spacer></v-spacer>
                  <v-btn @click="findGuest" white>Submit</v-btn>
                </v-form>
              </v-card>
              </v-card>
            </v-flex>
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
      submissionValid: true,
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
      rules: {
        required: value => {
          return !!value || 'Required.'
        }
      }
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
      this.$refs.rsvpSubmissionForm.validate()
      if (this.curGuest && this.checkGuest()) {
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
    },
    validateName (guestFamilyMember) {
      if (!guestFamilyMember.name && guestFamilyMember.food_choice !== 'Not Needed') {
        return 'required'
      }
      return true
    },
    checkGuest () {
      if (this.curGuest) {
        this.$store.state.rsvpSubmitFailure = undefined
        for (var guestMember of this.curGuest.familymember) {
          if (!guestMember.name && guestMember.food_choice !== 'Not Needed') {
            this.submissionValid = false
            return false
          }

          this.submissionValid = true
          return true
        }
      }
    }
  }
}
</script>
