<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Manage Users</h2>
      <b-message type="is-warning" role="alert" title="Work In Progress" :closable="false" size="is-small">
        This page is a work-in-progress. Do check back for more details.
      </b-message>
      <div class="columns is-gapless">
        <div class="field column">
          <b-switch v-model="showDetails">
            Show Extra Details
          </b-switch>
        </div>
        <div class="field column is-hidden-tablet">
          <b-switch v-model="tableForm">
            Table Mode
          </b-switch>
        </div>
      </div>
      <b-table :data="users" :loading="loading" :mobile-cards="!tableForm">
        <template slot-scope="props">
          <b-table-column field="name" label="Name" sortable searchable>
            <router-link class="user-link" :to="{ name: 'UserDetailsRoot', params: { id: props.row.id } }">{{ props.row.name }}</router-link>
          </b-table-column>
          <b-table-column field="initials" label="Initials" sortable searchable>
            {{ props.row.initials }}
          </b-table-column>
          <b-table-column field="depot" label="Depot" sortable searchable>
            {{ props.row.depot }}
          </b-table-column>
          <b-table-column field="branch" label="Branch" sortable searchable>
            {{ props.row.branch }}
          </b-table-column>
          <b-table-column field="phoneNumber" label="Phone Number" sortable searchable>
            {{ props.row.phoneNumber }}
          </b-table-column>
          <b-table-column field="id" label="ID" searchable>
            <span class="is-size-7 is-family-code">{{ props.row.id }}</span>
          </b-table-column>
        </template>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="question-circle" size="is-large">
                </b-icon>
              </p>
              <p>No users found.</p>
            </div>
          </section>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data () {
    return {
      loading: true,
      showDetails: false,
      tableForm: false,
      users: []
    }
  },
  methods: {
    reset () {
      this.loading = true
      this.$store.dispatch('common/updateAllUsers').then((data) => {
        const temp = []
        for (const key in data) {
          // Shallow clone the object, becuase you don't want to edit the master data
          const payload = Object.assign({}, data[key])
          payload['id'] = key
          temp.push(payload)
        }
        const branch = this.$store.state.user.currentUser.branch
        this.users = temp.sort((a, b) => {
          if ((a.branch === branch && b.branch === branch)) {
            return a.name > b.name ? 1 : -1
          } else if (a.branch === branch) {
            return -1
          } else {
            return a.name > b.name ? 1 : -1
          }
        })
        this.loading = false
      })
    }
  },
  mounted () {
    this.$store.dispatch('common/updateAllUsers').then((users) => {
      this.reset()
    })
  }
}
</script>
