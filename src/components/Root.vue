<template>
    <v-container fluid>
        <v-layout wrap row>
            <v-flex xs6 class="pa-2">
              <v-text-field v-model="filter" label="Søk etter sylte" prepend-icon="search"/>
            </v-flex>
            <v-flex xs6 class="pa-2">
              <v-select v-model="sort" prepend-icon="sort" @input="changeSort" :items="sortMethods" label="Sortering"/>
            </v-flex>
        </v-layout>
        <v-layout wrap row>
          <v-flex v-if="filter !== ''">
            Viser sylter som inneholder "{{filter}}".
          </v-flex>        
        </v-layout>
        <v-container fluid grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg3 xl2 v-for="track in filteredTracks" :key="track.title" >
              <v-card>
                <router-link :to="{name: 'sylter', params: {track: track.uri}}">
                  <v-card-media contain class="waveform" src="/static/waveform.png" height="150"/>
                </router-link>
                <v-card-text>
                  {{track.title}}
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
    </v-container>
</template>

<script>
import ContentService from '../services/ContentService'

const SORT_NEW_FIRST = 0
const SORT_OLD_FIRST = 1
const SORT_ALPHA_DESC = 2
const SORT_ALPHA_ASC = 3

export default {
  data () {
    return {
      filter: '',
      sort: null,
      tracks: [],
      sortMethods: [
        { text: 'Nyeste først', value: SORT_NEW_FIRST },
        { text: 'Eldste først', value: SORT_OLD_FIRST },
        { text: 'Alfabetisk', value: SORT_ALPHA_DESC },
        { text: 'Alfabetisk (bakvendt)', value: SORT_ALPHA_ASC }
      ]
    }
  },
  methods: {
    changeSort (sortValue) {
      switch (sortValue) {
        case SORT_NEW_FIRST:
          this.tracks.sort((a, b) => { return a.uploadDate > b.uploadDate })
          break
        case SORT_OLD_FIRST:
          this.tracks.sort((a, b) => { return a.uploadDate < b.uploadDate })
          break
        case SORT_ALPHA_DESC:
          this.tracks.sort((a, b) => { return a.title.localeCompare(b.title) })
          break
        case SORT_ALPHA_ASC:
          this.tracks.sort((a, b) => { return a.title.localeCompare(b.title) }).reverse()
          break
        default:
          break
      }
    },
    async getTracks () {
      try {
        const response = await ContentService.getTracks()
        this.tracks = response.data
        this.changeSort(this.sort.value)
      } catch (error) {

      }
    }
  },
  created () {
    this.sort = this.sortMethods[0]

    this.getTracks()
  },
  computed: {
    filteredTracks () {
      return this.tracks.filter(a => {
        return (a.title.toLowerCase().indexOf(this.filter.toLowerCase()) > -1) || (a.title.toLowerCase().indexOf(this.filter.toLowerCase()) > -1)
      })
    }
  }
}
</script>

<style scoped>
.waveform {
  background-color: indianred;
}
</style>
