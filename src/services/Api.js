import axios from 'axios'
import store from '@/store'

export default () => {
  return axios.create({
    baseURL: __API__,
    headers: {
      Authorization: 'Bearer ' + store.state.token
    }
  })
}
