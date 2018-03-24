<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs5>
        <v-container v-if="selectFiles" class="elevation-1">
          <h2 class="title">Last opp sylter</h2>
          <input type="file" @change="processFiles($event)" multiple/>
          <v-layout row wrap>
          <v-flex mx-3 my-3 v-for="track in tracks" :key="track.file.name">
          <v-card>
            <v-card-text>
              <v-form>
                <div class="title">{{track.file.name}}</div>
                <v-text-field v-model="track.data.title" label="Navn"></v-text-field>
                <v-text-field v-model="track.data.description" label="Beskrivelse" />
              </v-form>
            </v-card-text>
          </v-card>
          </v-flex>
          </v-layout>
          <v-btn @click="upload()">Last opp</v-btn>
        </v-container>
        <v-container v-else>
          <v-card>
            <v-list two-line>
              <template v-for="(item, index) in uploadedTracks">
                <v-list-tile
                  :color="item.status.done ? (item.status.error ? 'red' : 'green lighten-2') : ''"
                  avatar
                  ripple
                  @click="goToSylte(item.status.uri)"
                  :key="item.title"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title v-if="!item.status.done">Legger til sylte...</v-list-tile-sub-title>
                    <v-list-tile-sub-title v-else-if="item.status.done && item.status.error === null">Ferdig!</v-list-tile-sub-title>
                    <v-list-tile-sub-title v-else-if="item.status.done && item.status.error">{{item.status.error}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-progress-circular
                      color="grey"
                      indeterminate
                      v-if="!item.status.done"
                    />
                    <v-icon
                      color="green lighten-2"
                      v-else-if="item.status.done && item.status.error === null"
                    >check</v-icon>
                    <v-icon
                      color="red"
                      v-else-if="item.status.done && item.status.error"
                    >error</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider v-if="index + 1 < uploadedTracks.length" :key="index"></v-divider>
              </template>
            </v-list>
          </v-card>
          <v-btn v-if="!uploading" @click="selectFiles = true">Ny opplasting</v-btn>          
          <v-progress-linear :active="uploading" :indeterminate="percentCompleted >= 100" v-model="percentCompleted" />
        </v-container>
        <v-alert dismissible type="error" v-model="error">{{errorText}}</v-alert>
        <v-alert dismissible type="success" v-model="success">Upload complete!</v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ContentService from '@/services/ContentService'
export default {
  methods: {
    goToSylte (uri) {
      if (uri) {
        this.$router.push({name: 'sylter', params: {track: uri}})
      }
    },
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
      this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    },
    upload () {
      var form = new FormData()
      var data = {}
      this.selectFiles = false
      this.error = null
      this.uploading = true
      this.success = false

      this.tracks.forEach(track => {
        form.append('tracks', track.file)
        data[track.file.name] = track.data
      })
      form.append('data', JSON.stringify(data))
    
      ContentService.uploadTracks(form, {onUploadProgress: this.onUploadProgress})
      .then((response) => {
        var upload_id = response.data.upload_id
        var that = this
        return new Promise((resolve, reject) => {
          (function poll(){
              ContentService.getUploadStatus(upload_id)
              .then(response => {
                var uploadStatus = response.data
                that.uploadedTracks = uploadStatus.tracks
                if (uploadStatus.complete) {
                  return resolve()
                } else {
                  setTimeout(poll, 3000)                  
                }
              })
              .catch(error => {
                return reject(error)
              })
          })()
        })
      })
      .then(() => {
        this.uploading = false
        this.success = true
      })
      .catch((err) => {
        console.log(err)
        this.error = true
        this.errorText = err
        this.uploading = false
        this.selectFiles = true
      })
    }
  },
  data () {
    return {
      selectFiles: true,
      uploadedTracks: [],
      processing: false,
      uploading: false,
      success: false,
      error: false,
      errorText: null,
      percentCompleted: 0,
      tracks: []
    }
  }
}
</script>

<style>
</style>
