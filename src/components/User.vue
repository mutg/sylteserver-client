<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex xs12>
        <h3 class="headline mb-0">Info for {{this.$store.state.user.username}}</h3>
      </v-flex>
      <v-flex xs6>
        <v-layout wrap>
          <v-flex xs6 sm6 md6>
            <v-text-field label="Fornavn"></v-text-field>
          </v-flex>
          <v-flex xs6 sm6 md6>
            <v-text-field label="Fornavn"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  created () {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({name: 'root'})
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.isUserLoggedIn
    }
  },
  watch: {
    loggedIn (loggedIn) {
      if (!loggedIn) {
        this.$router.push({name: 'root'})
      }
    }
  }
}
</script>

<style>

</style>
