<template>
<v-container grid-list-md text-xs-center >
  <v-layout row wrap v-if="curGuest">
    <v-flex xs12 sm3>
      <v-card>
        <div>
          <p class="title">{{ curGuest.name }}</p>
          <p>Number of Reserved Seats: {{ curGuest.familymember.length }}</p>
          <p v-if="seatsNeeded > 0">Guests Attending: {{ seatsNeeded }}</p>
          <p v-else>Not Attending</p>
          <p v-if="curGuest.rsvp">RSVP Recieved: {{ curGuest.rsvp }}</p>
        </div>
        <div>
          <v-btn @click.stop="submitRSVP" white>Submit</v-btn>
        </div>
      </v-card>
    </v-flex>
    <v-flex xs12 sm8>
        <v-card>
            <p class="title">Menu Selection</p>
                <template v-for="(item, index) in curGuest.familymember">
                    <div :key="item.name">
                      <span class="body-2">Guest {{ (index + 1) }}</span>
                      <v-radio-group row v-model="item.food_choice">
                        <v-radio
                          v-for="option in foodChoices"
                          :key="item.name + option.label"
                          :label="`${option.label}`"
                          :value="option.model"
                        ></v-radio>
                      </v-radio-group>
                    </div>
                </template>
        </v-card>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else-if="!curRSVPURL">
    <v-flex >
      <v-card transparent>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <p class="title" xs10 offset-xs1>Find Your RSVP</p>
        <v-text-field
          v-model="findRsvp.name"
          label="Name"
          data-vv-name="findRsvp.name"
          required></v-text-field>
        <v-text-field
          v-model="findRsvp.rsvpURL"
          label="RSVP Code"
          data-vv-name="findRsvp.URL"
          required></v-text-field>
          <v-btn white>Submit</v-btn>
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
      this.$store.dispatch('getGuest', this.$route.params.guestURL)
      // axios.get('http://localhost:8000/rsvp/' + this.$route.params.guestURL)
      //   .then(function (response) {
      //     self.curGuest = response.data[0]

      //     // check if attendence is set
      //     if (!self.curGuest.will_attend) {
      //       self.curGuest.will_attend = 'False'
      //     }

      //     for (var member of self.curGuest.familymember) {
      //       if (!member.food_choice) {
      //         member.food_choice = self.foodChoices[0]
      //       }
      //       console.log(member.food_choice)
      //     }

      //     console.log(self.curGuest.familymember[0])
      //   }).catch(function (response) {
      //     console.log('FAILURE!!' + response)
      //   })
    } else if (!this.curGuest) {
      // show the rsvp search
    }
  },
  data () {
    return {
      radio: '',
      findRsvp: {
        name: '',
        rsvpURL: ''
      },
      foodChoices: [
        {
          label: 'Chicken',
          model: 'Chicken'
        },
        {
          label: 'Pork',
          model: 'Pork'
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
      ]
    }
  },
  computed: {
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
    curRSVPURL () {
      return this.$store.state.curRSVPURL
    },
    curGuest () {
      var guest = this.$store.state.currentGuest
      if (guest) {
        // check if attendence is set
        if (!guest.will_attend) {
          guest.will_attend = 'False'
        }

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
      if (this.curGuest) {
        let willAttend = this.seatsNeeded > 0
        console.log(this.curGuest)
        this.$store.dispatch('submitRSVP', willAttend)
      }
    }
  }
}
</script>
