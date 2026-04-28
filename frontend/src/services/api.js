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
  createExperience: (data) => http.post('/experiences', data),
  updateExperience: (id, data) => http.put(`/experiences/${id}`, data),
  deleteExperience: (id) => http.delete(`/experiences/${id}`),

  getEducation: () => http.get('/education'),
  createEducation: (data) => http.post('/education', data),
  updateEducation: (id, data) => http.put(`/education/${id}`, data),
  deleteEducation: (id) => http.delete(`/education/${id}`),

  getAchievements: () => http.get('/achievements'),
  createAchievement: (data) => http.post('/achievements', data),
  updateAchievement: (id, data) => http.put(`/achievements/${id}`, data),
  deleteAchievement: (id) => http.delete(`/achievements/${id}`),
  toggleFeaturedAchievement: (id) => http.patch(`/achievements/${id}/featured`),
  getCertificates: () => http.get('/certificates'),
  createCertificate: (data) => http.post('/certificates', data),
  updateCertificate: (id, data) => http.put(`/certificates/${id}`, data),
  deleteCertificate: (id) => http.delete(`/certificates/${id}`),
  toggleFeaturedCertificate: (id) => http.patch(`/certificates/${id}/featured`),

  sendMessage: (data) => http.post('/contact', data),
  getMessages: () => http.get('/contact'),
  updateMessage: (id, data) => http.patch(`/contact/${id}`, data),
  deleteMessage: (id) => http.delete(`/contact/${id}`),

  login: (credentials) => http.post('/auth/login', credentials),
  getMe: () => http.get('/auth/me'),
};
