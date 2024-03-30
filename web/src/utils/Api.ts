import axios from "axios"

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
  responseType: "json",
})

API.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("role-token")

    if (token) {
      config.headers["Authorization"] = "Bearer " + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
