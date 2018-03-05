<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs5>
        <v-container class="elevation-1">
          <h2 class="title">Last opp sylter</h2>
          <input type="file" @change="processFiles($event)" multiple/>
          <v-card m v-for="track in tracks" :key="track.file.name">
            <v-card-text>
              <v-form>
                <div class="title">{{track.file.name}}</div>
                <v-text-field v-model="track.data.title" label="Navn"></v-text-field>
                <v-text-field v-model="track.data.description" label="Beskrivelse" />
              </v-form>
            </v-card-text>
          </v-card>
        </v-container>
        <v-btn @click="upload()">Last opp</v-btn>
        <v-progress-linear :active="uploading" :indeterminate="percentCompleted >= 100" v-model="percentCompleted" />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ContentService from '@/services/ContentService'
export default {
  methods: {
    processFiles (event) {
      this.tracks = []
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i]
        this.tracks.push({
          file,
          data: {
            title: file.name.split('.')[0],
            description: ''
          }
        })
      }
    },
    onUploadProgress (progressEvent) {
      console.log(progressEvent)
      this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    },
    upload () {
      var form = new FormData()
      var data = {}

      this.tracks.forEach(track => {
        form.append('tracks', track.file)
        data[track.file.name] = track.data
      })
      form.append('data', JSON.stringify(data))

      this.uploading = true
      ContentService.uploadTracks(form, {onUploadProgress: this.onUploadProgress})
      .then(() => {
        this.uploading = false
      })
      .catch((err) => {
        console.log(err)
        this.uploading = false
      })
    }
  },
  data () {
    return {
      uploading: false,
      percentCompleted: 0,
      tracks: []
    }
  }
}
</script>

<style>
</style>
