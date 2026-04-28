import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
    }

    return Promise.reject(error);
  }
);

export const api = {
  getProfile: () => http.get('/profile'),
  upsertProfile: (data) => http.put('/profile', data),

  getProjects: () => http.get('/projects'),
  getFeaturedProjects: () => http.get('/projects/featured'),
  createProject: (data) => http.post('/projects', data),
  updateProject: (id, data) => http.put(`/projects/${id}`, data),
  deleteProject: (id) => http.delete(`/projects/${id}`),
  toggleFeaturedProject: (id) => http.patch(`/projects/${id}/featured`),

  getSkills: () => http.get('/skills'),
  createSkill: (data) => http.post('/skills', data),
  updateSkill: (id, data) => http.put(`/skills/${id}`, data),
  deleteSkill: (id) => http.delete(`/skills/${id}`),

  getExperience: () => http.get('/experiences'),
  deleteExperience: (id) => http.delete(`/experiences/${id}`),

  getEducation: () => http.get('/education'),
  deleteEducation: (id) => http.delete(`/education/${id}`),

  getAchievements: () => http.get('/achievements'),
  getCertificates: () => http.get('/certificates'),

  sendMessage: (data) => http.post('/contact', data),
  getMessages: () => http.get('/contact'),
  updateMessage: (id, data) => http.patch(`/contact/${id}`, data),
  deleteMessage: (id) => http.delete(`/contact/${id}`),

  login: (credentials) => http.post('/auth/login', credentials),
  getMe: () => http.get('/auth/me'),
};
