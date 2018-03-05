import Api from '@/services/Api'

export default {
  getTracks (uri, credentials) {
    return Api().get('tracks',
      {
        params: {
          uri
        }
      }
    )
  },
  uploadTracks (form, config) {
    return Api().post('tracks', form, config)
  }
}
