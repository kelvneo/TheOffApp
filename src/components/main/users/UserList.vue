<template>
  <div class="container">
    <section class="section">
      <h2 class="title">Manage Users</h2>
      <div class="columns is-multiline">
        <div class="column is-full">
          <b-field label="Search">
            <b-input type="text" v-model="search" placeholder="Search a Name" :disabled="loading" :loading="loading">
            </b-input>
          </b-field>
        </div>
        <div class="column is-full">
          <b-field class="is-marginless">
            <b-switch v-model="branchOnly">
              Show Branch Only
            </b-switch>
          </b-field>
          <b-field class="is-marginless">
            <b-switch v-model="showInactiveUsers" :disabled="showInactiveUsers" @input="reset">
              Show Inactive Users
            </b-switch>
          </b-field>
          <b-field>
            <b-switch v-model="showDetails">
              Show ID
            </b-switch>
          </b-field>
        </div>
      </div>

      <div class="columns is-multiline user-list" v-if="users">
        <div class="column is-half" v-for="user of filteredUsers" :key="user.id">
          <UserListItemCard :user.sync="user" :loading="loading" :showDetails="showDetails"></UserListItemCard>
        </div>
        <div class="column" v-if="filteredUsers.length === 0 ">
          <div class="box">
            <h4 class="title is-4 has-text-centered has-text-grey">No Users Found</h4>
          </div>
        </div>
      </div>
      <div class="columns is-multiline user-list" v-else>
        <div class="column is-half">
          <UserListItemCard :loading="loading"></UserListItemCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import UserListItemCard from './UserListItemCard.vue'

export default {
  name: 'UserList',
  components: {
    UserListItemCard
  },
  data () {
    return {
      loading: true,
      showDetails: false,
      tableForm: false,
      users: null,
      branchOnly: false,
      showInactiveUsers: false,
      search: ''
    }
  },
  computed: {
    filteredUsers () {
      const branch = this.$store.state.user.currentUser.branch
      return this.users.filter(val => (!this.search || val.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) && (!this.branchOnly || val.branch === branch))
    }
  },
  methods: {
    reset () {
      this.loading = true
      this.$store.dispatch(this.showInactiveUsers ? 'common/updateAllUsers' : 'common/updateAllActiveUsers').then((data) => {
        // console.log(this.$store.state.common.allUsersCollected)
        if (this.$store.state.common.allUsersCollected) {
          this.showInactiveUsers = true
        }
        const temp = []
        for (const key in data) {
          // Shallow clone the object, becuase you don't want to edit the master data
          const payload = Object.assign({}, data[key])
          payload['id'] = key
          temp.push(payload)
        }
        const branch = this.$store.state.user.currentUser.branch
        this.users = temp.sort((a, b) => {
          if (!!a.disabled !== !!b.disabled) {
            return a.disabled ? 1 : -1
          } else if ((a.branch === branch && b.branch === branch)) {
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
    this.$store.dispatch('common/updateAllActiveUsers').then((users) => {
      this.reset()
    })
  }
}
</script>
