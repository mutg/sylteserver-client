<template>
  <v-bottom-sheet :persistent="true" :value="$store.state.audioPlayer.active" :hide-overlay="true">
      <v-card tile>
        <v-progress-linear height="10" :value="progress * 100" class="my-0"></v-progress-linear>
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title v-if="track"><router-link :to="{name: 'sylter', params: {track: track.uri}}">{{track.title}}</router-link></v-list-tile-title>
              <v-list-tile-title v-else>n/a</v-list-tile-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-list-tile-action>
              <v-btn v-if="!$store.state.audioPlayer.paused" @click="audio.pause()" icon>
                <v-icon>pause</v-icon>
              </v-btn>
              <v-btn v-else @click="audio.play()" icon>
                <v-icon>play_arrow</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn  @click="close" icon>
                <v-icon>remove</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
  </v-bottom-sheet>
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus'

export default {
  data () {
    return {
      progress: 0,
      audio: null
    }
  },
  methods: {
    update (e) {
      if (this.audioPlayer.track && this.audioPlayer.audio) {
        this.progress = this.audio.currentTime / (this.track.data.frameCount / this.track.data.frameRate)
      }
      requestAnimationFrame(this.update)
    },
    close (e) {
      this.$store.dispatch('closePlayer')
    }
  },
  computed: {
    ...mapGetters({
      track: 'getTrack',
      audioPlayer: 'getPlayer'
    })
  },
  watch: {
    track (track) {
      if (track) {
        this.audio.pause()
        this.audio.src = __API__ + '/content/tracks/' + track.filename
        this.audio.play()        
      } else {
        this.audio.src = null
      }
    }
  },
  created () {
    this.audio = new Audio()
      this.$store.dispatch('setAudio', this.audio)
    this.update()

    this.audio.addEventListener('pause', () => {
      this.$store.dispatch('setPaused', true)
    })

    this.audio.addEventListener('play', () => {
      this.$store.dispatch('setPaused', false)
    })

    EventBus.$on('setPosition', (newPosition) => {
      this.$store.dispatch('setPosition', newPosition)
      this.audioPlayer.audio.currentTime = newPosition * (this.track.data.frameCount / this.track.data.frameRate)
      this.audio.play()
    })
    EventBus.$on('setPaused', (value) => {
      if (!value) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    })
    EventBus.$on('setVolume', (volume) => {
      this.$store.dispatch('setVolume', volume)
      this.audio.volume = volume
    })
    EventBus.$on('setTrack', track => {
      this.$store.dispatch('setTrack', track)
    })
  }
}
</script>

<style>

</style>
