import Api from '@/services/Api'

export default {
  getTracks (query, credentials) {
    return Api().get('tracks',
      {
        params: {
          ...query
        }
      }
    )
  },
  uploadTracks (form, config) {
    return Api().post('tracks', form, config)
  },
  scanForNewTracks () {
    return Api().post('scan')
  },
  getScanStatus () {
    return Api().get('scan/status')
  }
}
