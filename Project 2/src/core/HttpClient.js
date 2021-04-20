import axios from 'axios'
import { sensitiveStorage } from './services/SensitiveStorage';


const config = {
   baseURL: 'https://localhost:44317/api/ApiRollCallSystem', 
   headers: { 
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
}

const httpClient = axios.create(config)

const loggerInterceptor = config => {
  return config
}

/** Adding the request interceptors */
// httpClient.interceptors.request.use(authInterceptor);
httpClient.interceptors.request.use(
  function (config) {
    const token = sensitiveStorage.getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }


    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

httpClient.interceptors.request.use(loggerInterceptor)

/** Adding the response interceptors */
httpClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 422) {
      return Promise.reject(error)
    } else {
      return Promise.reject(error)
    }
  }
)

/**
 *
 * @param {*} url
 * @param {*} requestBody
 */
export const sendPost = async (url, requestBody) => {
    
  let response = await httpClient.post(url, requestBody)

  return response
}

/**
 *
 * @param {*} url
 */
export const sendGet = async (url) => {

  let response = await httpClient.get(url)

  return response
}

export const upload = async(url, formData, config) =>{
    let response = await httpClient.post(url, formData, config);
    return response;
}
