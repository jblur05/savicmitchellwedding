<template>
    <v-content>
        <v-card white>
          <file-upload v-model="filename" @formData="uploadFile"></file-upload>
          <add-user-modal :isComponentModalActive="isComponentModalActive" v-on:close-add-guest-modal="isComponentModalActive=false" v-on:add-new-guest="addNewGuest"></add-user-modal>
        </v-card>
        <v-layout>
          <v-data-table
            :headers="headers"
            :items="$store.state.guests"
            key='aTable'>
            <template slot="items" slot-scope="prop" >
              <td class="text-xs-right">{{ prop.item.id }}</td>
              <td>{{ prop.item.name }}</td>
              <td>{{ prop.item.num_guests}}</td>
              <td>{{ prop.item.address + ', ' + prop.item.city + ', ' + prop.item.state + ' ' + prop.item.zip_code + ' ' + prop.item.country }}</td>
              <td>{{ prop.item.rsvp }}</td>
              <td>{{ prop.item.rsvp_url }}</td>
              <td><img v-bind:src="'https://chart.googleapis.com/chart?cht=qr&chs=177x177&chl=https://www.savicmitchellwedding.com/#/rsvp/' + prop.item.rsvp_url"/></td>
            </template>
          </v-data-table>
       </v-layout>
    </v-content>
</template>

<script>
import AddUserModal from './AddUserModal.vue'
import FileUpload from './FileUpload.vue'
import axios from 'axios'

export default {
  components: {
    AddUserModal, FileUpload
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
        } ],
      files: []
    }
  },
  computed: {

  },
  methods: {
    addNewGuest (guestInfo) {
      this.$store.dispatch('addGuest', this.$createGuest(guestInfo.guestName, guestInfo.numGuests, false, guestInfo.address, guestInfo.city, guestInfo.state, guestInfo.country, guestInfo.zipCode))
    },
    uploadFile (formData) {
      formData.append('file', this.files[0])
      axios.post(
        'https://guestbe.savicmitchellwedding.com/upload/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }
      ).then(response => {
        this.$store.dispatch('getGuests')
        console.log('SUCCESS!!')
      }).catch(response => {
        console.err(response)
        console.err('FAILURE!!')
      })
    }
  }
}
</script>
