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
            <waveform ref="waveform" :interactive="true" :color="track.color" :active="isActive" :audio="audioPlayer.audio" :track="track" />
          </div>
        </v-flex>
        <v-flex>
          <v-btn v-if="false" @click="onPlay">
            Play
          </v-btn>
        </v-flex>
      </v-layout>
    </div>  
  </v-container>
</template>

<script>
import ContentService from '../services/ContentService'
import Waveform from '@/components/Waveform'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus'

var resizeTimer

export default {
  data () {
    return {
      track: null
    }
  },
  computed: {
    isActive () {
      if (this.audioPlayer.track) {
        return this.audioPlayer.track.uri === this.track.uri
      }
      return false
    },
    ...mapGetters({
        audioPlayer: 'getPlayer'      
    })
  },
  components: { Waveform },
  created () {
    this.findTrack()
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onPlay (e) {
      EventBus.$emit('setTrack', this.track)
    },
    findTrack () {
      ContentService.getTracks({uri: this.$route.params.track})
      .then(response => {
        if (response.data) {
          this.track = response.data[0]
        }
      })
    },
    onResize (e) {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        this.$refs.waveform.generate()
        this.$refs.waveform.drawWave()
      }, 250)
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

