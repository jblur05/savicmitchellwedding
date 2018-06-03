<template>
    <v-content>
        <v-card white>
          <file-upload v-model="filename" @formData="uploadFile"></file-upload>
          <add-user-modal :isComponentModalActive="isComponentModalActive" v-on:close-add-guest-modal="isComponentModalActive=false" v-on:add-new-guest="addNewGuest"></add-user-modal>
        </v-card>
        <v-layout>
          <v-data-table
            :headers="headers"
            :items="guests"
            hide-actions
            class="elevation-1"
            key='aTable'>
            <template slot="items" slot-scope="props">
              <td class="text-xs-right">{{ props.item.id }}</td>
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.numGuests }}</td>
              <td>{{ props.item.address + ' ' + props.item.city + ' ' + props.item.state + ' ' + props.item.zip_code + ' ' + props.item.country }}</td>
              <td>{{ props.item.rsvp }}</td>
              <td>{{ props.item.rsvp_url }}</td>
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
    guests () {
      return this.$store.state.guests
    }
  },
  methods: {
    addNewGuest (guestInfo) {
      this.$store.dispatch('addGuest', this.$createGuest(guestInfo.guestName, guestInfo.numGuests, false, guestInfo.address, guestInfo.city, guestInfo.state, guestInfo.country, guestInfo.zipCode))
    },
    uploadFile (formData) {
      formData.append('file', this.files[0])
      axios.post(
        'http://localhost:8000/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }
      ).then(function () {
        console.log('SUCCESS!!')
      }).catch(function () {
        console.log('FAILURE!!')
      })
    }
  }
}
</script>
