<template>
  <v-container grid-list-xs text-xs-center>
    <v-layout row wrap>
      <v-flex xs8 offset-xs2>
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">Opprett konto</h3>
          </v-card-title>
          <v-card-text>
            <v-form wrap>
                <v-flex xs12>
                    <v-text-field autocomplete="off" v-model="username" label="Brukernavn" type="username"></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field autocomplete="off" v-model="password" label="Passord" type="password"></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field autocomplete="off" v-model="passwordConfirm" label="Oppgi passord igjen" type="password"></v-text-field>
                </v-flex>
                <v-btn dark color="red lighten-1" block @click="register()">
                    OK
                </v-btn>
            </v-form>
            <span class="red--text">{{error}}</span>        
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService'
export default {
  data () {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
      error: null
    }
  },
  created () {
    if (this.$store.state.isUserLoggedIn) {
      this.$router.push({name: 'root'})
    }
  },
  methods: {
    async register () {
      try {
        const response = await AuthenticationService.register({
          username: this.username,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.isUserLoggedIn
    }
  },
  watch: {
    loggedIn (loggedIn) {
      if (loggedIn) {
        this.$router.push({name: 'root'})
      }
    }
  }
}
</script>

<style>

</style>
