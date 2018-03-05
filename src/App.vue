<template>
  <div id="app">
    <v-app>
      <v-toolbar dark color="red lighten-1">
        <v-toolbar-title  class="white--text">
          <span class="title" @click="$router.push({name: 'root'})">Sylteserver</span>
        </v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn @click="$router.push({name: 'uploadtracks'})" v-if="loggedIn" flat>
            <v-icon>file_upload</v-icon>
          </v-btn>
          <v-btn flat
            v-if="!$store.state.isUserLoggedIn"
            @click="$refs.loginDialog.open()"
          >
            Logg inn
          </v-btn>
          <v-menu v-if="$store.state.isUserLoggedIn" offset-y>
            <v-btn slot="activator" flat>
              {{$store.state.user.username}}
            </v-btn>
            <v-list>
              <v-list-tile @click="$router.push({name: 'user'})">
                <v-list-tile-title>
                  Info
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="logout()">
                <v-list-tile-title>
                  Logg ut
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>
      <login ref="loginDialog" />
      <v-content>
        <router-view/>     
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Login from '@/components/Login'
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'app',
  data () {
    return {

    }
  },
  components: {
    Login
  },
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      localStorage.removeItem('token')
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.isUserLoggedIn
    }
  },
  created () {
    var token = localStorage.getItem('token')
    if (token) {
      this.$store.dispatch('setToken', token)
      .then(() => {
        return AuthenticationService.getSession()
      })
      .then((response) => {
        this.$store.dispatch('setUser', response.data.user)
      })
      .catch((err) => {
        console.log(err)
        localStorage.removeItem('token')
        this.$store.dispatch('setToken', null)
      })
    }
  }
}
</script>

<style>
.title {
  cursor: pointer;
}
</style>


