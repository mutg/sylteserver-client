<template>
  <div id="app">
    <v-app>
      <v-toolbar dark color="red">
        <v-toolbar-title  class="white--text">
          <span class="title" @click="$router.push('/')">Sylteserver</span>
        </v-toolbar-title>
        <v-breadcrumbs divider="/">
            <v-breadcrumbs-item
              v-if="$route.meta.title"
              :key="$route.meta.title"
              :disabled="true"
            >
              {{$route.meta.title}}
            </v-breadcrumbs-item><v-breadcrumbs-item
              v-for="param in $route.params"
              :key="param"
              :disabled="true"
            >
              {{ param }}
            </v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-btn @click="$router.push({name: 'adminpanel'})" flat v-if="$store.state.isUserLoggedIn && $store.state.user.admin">
          <v-icon>settings</v-icon>
        </v-btn>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn @click="$router.push({name: 'upload'})" v-if="loggedIn" flat>
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
        <router-view v-if="initDone"/>     
      </v-content>
      <audio-player />
    </v-app>
  </div>
</template>

<script>
import Login from '@/components/Login'
import AudioPlayer from '@/components/AudioPlayer'
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'app',
  data () {
    return {
      initDone: false
    }
  },
  components: { AudioPlayer, Login },
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
        this.initDone = true
      })
      .catch((err) => {
        console.log(err)
        localStorage.removeItem('token')
        this.$store.dispatch('setToken', null)
        this.initDone = true
      })
    } else {
      this.initDone = true
    }
  }
}
</script>

<style>
.title {
  cursor: pointer;
}
</style>


