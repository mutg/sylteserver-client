<template>
  <v-card>
    <v-card>
      <v-card-title>
        <span class="title">{{track.title}}</span>
      </v-card-title>
      <div style="cursor: pointer" @click="$router.push({name:'sylter', params: {track: track.uri}})">
        <waveform ref="waveform" :audio="audioPlayer.audio" :active="waveformActive" :color="track.color" :interactive="false" :track="track" />
        <v-icon v-if="waveformActive" x-large class="playingicon">volume_up</v-icon>
      </div>
      <v-card-actions>
        <v-btn v-if="!waveformActive || isPaused" @click="play" flat block>
          <v-icon button>
            play_arrow
          </v-icon>
        </v-btn>
        <v-btn v-else @click="pause" flat block>
          <v-icon button>
            pause
          </v-icon>
        </v-btn>
        <v-btn flat @click="favorite" block color="black"><v-icon button>favorite</v-icon></v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import Waveform from '@/components/Waveform'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus'

export default {
  computed: {
    ...mapGetters({
      audioPlayer: 'getPlayer'
    }),
    waveformActive () {
      if (!this.audioPlayer.track) return false
      return this.audioPlayer.track.uri === this.track.uri
    },
    isPaused () {
      return this.audioPlayer.paused
    }
  },
  props: ['track'],
  methods: {
    play (e) {
      if (this.audioPlayer.track && this.audioPlayer.track.uri === this.track.uri) {
        EventBus.$emit('setPaused', false)
      } else {
        EventBus.$emit('setTrack', this.track)
      }
    },
    pause (e) {
      EventBus.$emit('setPaused', true)
    },
    favorite (e) {
     EventBus.$emit('setFavorite', this.track)
    },
    redrawWaveform () {
      this.$refs.waveform.generate()
      this.$refs.waveform.drawWave()
    }
  },
  components: { Waveform }
}
</script>

<style>
.playingicon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
