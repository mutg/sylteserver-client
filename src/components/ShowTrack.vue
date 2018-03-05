<template>
  <v-container>
    <div v-if="track">
      <v-layout column>
        <v-flex>
          <div class="title" >
            {{track.title}}
          </div>
        </v-flex>
        <v-flex>
          <div class="waveform">
            <waveform :points="track.data.waveformjs" />
          </div>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex>
              <v-card>
                <v-card-text>
                  {{track.description}}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex>
              hey
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import ContentService from '../services/ContentService'
import Waveform from '@/components/Waveform'

export default {
  data () {
    return {
      track: null
    }
  },
  components: { Waveform },
  created () {
    this.findTrack()
  },
  methods: {
    findTrack () {
      ContentService.getTracks(this.$route.params.track)
      .then(response => {
        if (response.data) {
          this.track = response.data[0]
        }
      })
    }
  },
  watch: {
    '$route.params.track' (track) {
      this.findTrack()
    }
  }
}
</script>

<style>

</style>

