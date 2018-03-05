<template>
  <v-dialog v-model="dialog" max-width="300px">
    <v-card>
      <v-card-title>
        <h3 class="headline mb-0">Logg inn</h3>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="username" label="Brukernavn" type="username"></v-text-field>
          <v-text-field v-model="password" label="Passord" type="password"></v-text-field>
          <span class="red--text">{{error}}</span>
          <v-btn :disabled="loading" :loading="loading" dark color="red lighten-1" block @click="login()">
            OK
          </v-btn>
          <div class="text-xs-center">
            <a href="" @click.prevent="goToRegister()">Opprett konto</a>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import AuthenticationService from '../services/AuthenticationService'
export default {
  data () {
    return {
      loading: false,
      username: '',
      password: '',
      error: null,
      dialog: false
    }
  },
  methods: {
    async login () {
      try {
        this.loading = true
        const response = await AuthenticationService.login({
          username: this.username,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.dialog = false
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.error
        } else {
          this.error = 'Får ikke kontakt med server'
        }
      }
      this.loading = false
    },
    open () {
      this.dialog = true
    },
    goToRegister () {
      this.dialog = false
      this.$router.push({name: 'register'})
    }
  },
  watch: {
    dialog () {
      this.error = null
    }
  }
}
</script>

<style>
</style>
