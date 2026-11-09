import { create } from 'zustand';
import { api } from '../services/api';

const getInitialState = () => ({
  profile: null,
  projects: [],
  featuredProjects: [],
  skills: [],
  skillsByCategory: {},
  experience: [],
  education: [],
  certificates: [],
  achievements: [],
  loading: true,
  loadError: null,
  token: localStorage.getItem('adminToken') || null,
  isAdmin: Boolean(localStorage.getItem('adminToken')),
});

const sortByOrder = (items = []) =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const sortByOrderThenDate = (items = [], key = 'startDate') =>
  [...items].sort((a, b) => {
    const orderDiff = (a?.order ?? 0) - (b?.order ?? 0);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return new Date(b?.[key] || 0) - new Date(a?.[key] || 0);
  });

const groupSkills = (items = []) =>
  items.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

let portfolioRequest;

export const useStore = create((set, get) => ({
  ...getInitialState(),

  setAuth: (token) => {
    localStorage.setItem('adminToken', token);
    set({ token, isAdmin: true });
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    set({ token: null, isAdmin: false });
  },

  hydrateData: (payload) => {
    const projects = sortByOrder(payload.projects);
    const skills = sortByOrder(payload.skills);

    set({
      profile: payload.profile,
      projects,
      featuredProjects: projects.filter((item) => item.featured),
      skills,
      skillsByCategory: groupSkills(skills),
      experience: sortByOrderThenDate(payload.experience),
      education: sortByOrderThenDate(payload.education),
      certificates: sortByOrderThenDate(payload.certificates, 'issueDate'),
      achievements: sortByOrderThenDate(payload.achievements, 'date'),
      loading: false,
      loadError: null,
    });
  },

  init: () => {
    if (portfolioRequest) {
      return portfolioRequest;
    }

    set({ loading: true, loadError: null });

    portfolioRequest = api.getPortfolio()
      .then(({ data }) => get().hydrateData(data))
      .catch((error) => {
        console.error('Failed to initialize frontend store:', error);
        set({ loading: false, loadError: error.message || 'Portfolio data is temporarily unavailable.' });
      })
      .finally(() => {
        portfolioRequest = null;
      });

    return portfolioRequest;
  },

  fetchAllData: async () => {
    await get().init();
  },
}));
