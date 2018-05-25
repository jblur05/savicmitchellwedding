<template>
    <div>
        <section>
            <b-field grouped >
                <a class="button is-primary"
                   @click="isComponentModalActive=true">Add Guest</a>
            </b-field>
            <b-field class="file">
                <b-upload v-model="files">
                    <a class="button is-primary">
                        <b-icon icon="upload"></b-icon>
                        <span>Click to upload</span>
                    </a>
                </b-upload>
                <span class="file-name"
                    v-if="files && files.length">
                    {{ files[0].name }}
                </span>
            </b-field>
        </section>
        <b-table :data="guests"
                 :bordered=true
                 :striped=true
                 :narrowed=true
                 :hoverable=true>
            <template slot-scope="props">
                <b-table-column field="id" label="ID" width="40" numeric>
                        {{ props.row.id }}
                </b-table-column>
                <b-table-column field="name" label="Name" width="40">
                        {{ props.row.name }}
                </b-table-column>
                <b-table-column field="num_guests" label="Guests" width="40" numeric>
                        {{ props.row.num_guests }}
                </b-table-column>
                <b-table-column field="address" label="Address" width="40">
                        {{ props.row.address }}
                </b-table-column>
                <b-table-column field="menu_selection" label="Menu Selection" width="40">
                        {{ props.row.menu_selection }}
                </b-table-column>
                <b-table-column field="rsvp" label="RSVP Date" width="40">
                        {{ props.row.rsvp }}
                </b-table-column>
            </template>
        </b-table>
        <add-user-modal :isComponentModalActive="isComponentModalActive" v-on:close-add-guest-modal="isComponentModalActive=false"
        v-on:add-new-guest="addNewGuest"></add-user-modal>
    </div>
</template>

<script>
import AddUserModal from './AddUserModal.vue'

export default {
  components: {
    AddUserModal
  },
  data () {
    return {
      isComponentModalActive: false,
      files: ''
    }
  },
  computed: {
    guests () {
      return this.$store.state.guests
    }
  },
  methods: {
    addNewGuest (guestInfo) {
      let address = guestInfo.address + ' ' + guestInfo.city + ', ' + guestInfo.state + ' ' + guestInfo.zipCode
      this.$store.dispatch('addGuest', this.createGuest('todo', guestInfo.name, guestInfo.numGuests, address, '', ''))
    },
    createGuest (id, name, numGuests, address, menuSelection, rsvp) {
      return { 'id': id, 'name': name, 'num_guests': numGuests, 'address': address, 'menu_selection': menuSelection, 'rsvp': rsvp }
    },
    uploadFile () {

    }
  }
}
</script>
