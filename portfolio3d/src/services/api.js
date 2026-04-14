import axios from 'axios'

const http = axios.create({ baseURL: 'http://localhost:3000/api', timeout: 12000 })

http.interceptors.request.use(cfg => {
  const t = localStorage.getItem('adminToken')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export const api = {
  profile:      { get: ()      => http.get('/profile') },
  projects:     { getAll: ()   => http.get('/projects'), getFeatured: () => http.get('/projects/featured') },
  skills:       { getAll: ()   => http.get('/skills') },
  education:    { getAll: ()   => http.get('/education') },
  experience:   { getAll: ()   => http.get('/experiences') },
  certificates: { getAll: ()   => http.get('/certificates') },
  achievements: { getAll: ()   => http.get('/achievements') },
  contact:      { send: (d)    => http.post('/contact', d) },
  auth:         { login: (e,p) => http.post('/auth/login', { email:e, password:p }) },
}
