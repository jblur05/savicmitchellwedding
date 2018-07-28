<template>
    <v-content>
      <Login v-if="!isLoggedIn">
      </Login>
      <v-content v-else>
        <v-card white>
          <add-user-modal :isComponentModalActive="isComponentModalActive" v-on:close-add-guest-modal="isComponentModalActive=false" v-on:add-new-guest="addNewGuest"></add-user-modal>
           <v-layout row white justify-center>
            <v-btn color="error" dark @click.native.stop="logout()">Logout</v-btn>
          </v-layout>
          <v-layout row white justify-center>
            <div>Number of Guests: {{ weddingStats.numGuests }}<br/>
            Number Chicken: {{ weddingStats.chicken }}<br/>
            Number Ravioli: {{ weddingStats.ravioli }}<br/>
            Number Child: {{ weddingStats.child }}</div>
          </v-layout>
        </v-card>
        <v-data-table
            :headers="headers"
            hide-actions
            :items="guestList"
            key='aTable'>
            <template slot="items" slot-scope="prop" >
              <tr @click="prop.expanded = !prop.expanded">
                <td class="text-xs-right">{{ prop.item.id }}</td>
                <td>{{ prop.item.name }}</td>
                <td>{{ prop.item.num_guests}}</td>
                <td>{{ prop.item.address + ', ' + prop.item.city + ', ' + prop.item.state + ' ' + prop.item.zip_code + ' ' + prop.item.country }}</td>
                <td>{{ prop.item.rsvp }}</td>
                <td>{{ prop.item.rsvp_url }}</td>
                <td>{{ prop.item.will_attend ? 'Attending' : 'Not Attending' }}</td>
                <!-- <td><img v-bind:src="'https://chart.googleapis.com/chart?cht=qr&chs=177x177&chl=https://www.savicmitchellwedding.com/#/rsvp/' + prop.item.rsvp_url"/></td> -->
              </tr>
            </template>
            <template slot="expand" slot-scope="prop">
              <tr>
                <td/>
                <td>ID</td>
                <td>guestName</td>
                <td>food_choice</td>
              </tr>
              <template v-for="family_member in prop.item.family_members">
                <tr :key="family_member.id">
                  <td/>
                  <td>{{ family_member.id }}</td>
                  <td>{{ family_member.name }}</td>
                  <td>{{ family_member.food_choice }}</td>
                </tr>
              </template>
            </template>
          </v-data-table>
     </v-content>
    </v-content>
</template>

<script>
import AddUserModal from './AddUserModal.vue'
import FileUpload from './FileUpload.vue'
import Login from './Login.vue'
import axios from 'axios'

export default {
  components: {
    AddUserModal, FileUpload, Login
  },
  data () {
    return {
      filename: '',
      isComponentModalActive: false,
      guesters: [],
      headers: [
        {
          text: 'ID',
          value: 'id',
          align: 'left',
          sortable: 'true'
        },
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Number Guests',
          value: 'numGuests'
        },
        {
          text: 'Address',
          value: 'address'
        },
        {
          text: 'RSVP Date',
          value: 'address'
        },
        {
          text: 'RSVP URL',
          value: 'rsvpURL'
        },
        {
          text: 'Will Attend',
          value: 'willAttend'
        } ],
      files: []
    }
  },
  computed: {
    isLoggedIn () {
      this.getGuests()
      return this.$store.state.isLoggedIn
    },
    guestList () {
      return this.$store.state.guests
    },
    weddingStats () {
      return this.$store.state.weddingStats
    }
  },
  methods: {
    getGuests () {
      if (this.$store.state.isLoggedIn) {
        this.$store.dispatch('getGuests')
      }
    },
    addNewGuest (guestInfo) {
      this.$store.dispatch('addGuest', this.$createGuest(guestInfo.guestName, guestInfo.numGuests, false, guestInfo.address, guestInfo.city, guestInfo.state, guestInfo.country, guestInfo.zipCode))
    },
    uploadFile (formData) {
      formData.append('file', this.files[0])
      axios.post(
        'https://guestbe.savicmitchellwedding.com/upload/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }
      ).then(response => {
        this.$store.dispatch('getGuests')
      }).catch(response => {
        console.err(response)
        console.err('FAILURE!!')
      })
    },
    logout () {
      this.$store.dispatch('manageLogout')
    }
  }
}
</script>
