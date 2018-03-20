<template>
<v-layout row pt-2>
    <v-flex xs12>
      <v-card>
        <v-toolbar>
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar>
        <v-list two-line subheader>
          <v-list-tile :disabled="isCheckingNewTracks" @click="checkNewTracks()">
            <v-list-tile-content>
              <v-list-tile-title>Sjekk for nye sylter!</v-list-tile-title>
              <v-list-tile-sub-title>{{checkMessage}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-progress-circular v-if="isCheckingNewTracks" indeterminate color="red"></v-progress-circular>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Show your status</v-list-tile-title>
              <v-list-tile-sub-title>Your status is visible to everyone</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import ContentService from '@/services/ContentService'

export default {
  data () {
    return {
      isCheckingNewTracks: false,
      checkMessage: 'Sist sjekket #NÅR'
    }
  },
  methods: {
    checkNewTracks () {
      if (this.isCheckingNewTracks) return
      this.isCheckingNewTracks = true
      ContentService.scanForNewTracks()
      .then(response => {
        let trackCount = response.data.tracks.length
        if (trackCount > 0) {
          this.checkMessage = 'Legger til ' + trackCount + ' nye sylter...'
          return new Promise((resolve, reject) => {
            (function pollScan(){
                ContentService.getScanStatus()
                .then(response => {
                  var scanObject = response.data
                  if (scanObject.complete) {
                    return resolve(scanObject.tracks)
                  } else {
                    setTimeout(pollScan, 3000)                  
                  }
                })
                .catch(error => {
                  return reject(error)
                })
            })()
          })
          .then((tracks) => {
            this.checkMessage = 'La til ' + tracks.length + ' nye sylter'
          })
        } else {
          this.checkMessage = 'Ingen nye sylter funnet!'
        }
      })
      .catch(error => {
        this.checkMessage = 'Kunne ikke søke. Prøv igjen snart!'
        console.log(error)
      })
      .finally(() => {
        this.isCheckingNewTracks = false
      })
    }
  }
}
</script>

<style>

</style>
