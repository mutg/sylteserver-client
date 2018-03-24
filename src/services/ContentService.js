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
    return Api().post('tracks/upload', form, config)
  },
  getUploadStatus(id) {
    return Api().get('tracks/upload/' + id)
  },
  scanForNewTracks () {
    return Api().post('scan')
  },
  getScanStatus () {
    return Api().get('scan/status')
  }
}
