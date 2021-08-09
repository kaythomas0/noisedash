import Axios from 'axios'

const instance = Axios.create({
  withCredentials: true
})

export default instance
