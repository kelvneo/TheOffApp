<template>
  <div>
    <section class="section">
      <div class="container">
        <h4 class="title">Approve Users</h4>
        <b-progress size="is-small" v-if="loading"></b-progress>
        <b-table :data="tempUsers" :loading="loading">
          <template slot-scope="props">
            <b-table-column field="name" label="Name">
              {{ props.row.name }}
            </b-table-column>
            <b-table-column field="depot" label="Depot">
              {{ props.row.depot }}
            </b-table-column>
            <b-table-column field="branch" label="Branch">
              {{ props.row.branch }}
            </b-table-column>
            <b-table-column field="phoneNumber" label="Phone Number">
              {{ props.row.phoneNumber }}
            </b-table-column>
            <b-table-column field="initials" label="Initials">
              <b-input v-model="props.row.initials" placeholder="A G Tan" required>
              </b-input>
            </b-table-column>
            <b-table-column field="id" label="Actions">
              <div class="buttons">
                <b-button type="is-success" icon-left="check" :disabled="loading" @click="approveUser(props)">
                  Approve
                </b-button>
                <b-button type="is-danger" icon-left="minus-circle" :disabled="loading" @click="deleteTemp(props)">
                  Deny
                </b-button>
              </div>
            </b-table-column>
          </template>
          <template slot="empty">
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>
                  <b-icon icon="question-circle" size="is-large">
                  </b-icon>
                </p>
                <p>No temporary users found.</p>
              </div>
            </section>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>

<script>
// import * as firebase from 'firebase'
// import 'firebase/auth'

export default {
  name: 'ApproveUsers',
  data () {
    return {
      loading: true,
      tempUsers: []
    }
  },
  methods: {
    approveUser (user) {
      if (!user.row.initials) {
        this.$buefy.notification.open({
          message: 'The user needs an initial.',
          type: 'is-danger'
        })
      } else {
        const payload = {
          id: user.row.id,
          data: {
            name: user.row.name,
            depot: user.row.depot,
            branch: user.row.branch,
            phoneNumber: user.row.phoneNumber,
            initials: user.row.initials,
            perm: true
          }
        }
        this.loading = true
        this.$store.dispatch('user/createUser', payload).then(() => {
          this.$store.dispatch('user/deleteTempUser', user.row.id).then(() => {
            this.tempUsers.splice(user.index, 1)
            this.$buefy.notification.open({
              message: 'The user is now approved!',
              type: 'is-success'
            })
            this.loading = false
          }).catch((err) => {
            this.$buefy.notification.open({
              message: 'The temporary user cannot be deleted.',
              type: 'is-warning'
            })
            console.error(err)
            this.loading = false
          })
        }).catch((err) => {
          this.$buefy.notification.open({
            message: 'The user cannot be approved.',
            type: 'is-danger'
          })
          console.error(err)
          this.loading = false
        })
      }
    },
    deleteTemp (user) {
      this.loading = true
      this.$store.dispatch('user/deleteTempUser', user.row.id).then(() => {
        this.tempUsers.splice(user.index, 1)
        this.$buefy.notification.open({
          message: 'The user is deleted.',
          type: 'is-success'
        })
        this.loading = false
      }).catch((err) => {
        this.$buefy.notification.open({
          message: 'The temporary user cannot be deleted.',
          type: 'is-warning'
        })
        console.error(err)
        this.loading = false
      })
    }
  },
  created () {
    this.$store.dispatch('user/getTempUsers').then((snapshot) => {
      snapshot.forEach(doc => {
        const data = doc.data()
        data['id'] = doc.id
        this.tempUsers.push(data)
      })
      this.loading = false
    }).catch((err) => {
      this.$buefy.notification.open({
        message: 'Unable to load the data',
        type: 'is-danger'
      })
      this.loading = false
      console.error(err)
    })
  }
}
</script>
