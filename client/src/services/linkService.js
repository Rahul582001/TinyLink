import axios from 'axios'

// Use Vite env var `VITE_API_BASE_URL` if provided, otherwise default to localhost:4000
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const BACKEND_BASE = BASE.replace(/\/$/, '')
const api = axios.create({ baseURL: `${BACKEND_BASE}/api/links` })

export const createLink = (data) => api.post('/', data) //create a short link
export const listLinks = () => api.get('/')  //list all links
export const getLink = (code) => api.get(`/${code}`) //get link details
export const deleteLink = (code) => api.delete(`/${code}`) //delete a link

export { BACKEND_BASE }
export default api
