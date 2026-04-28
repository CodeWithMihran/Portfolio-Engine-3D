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
  token: localStorage.getItem('adminToken') || null,
  isAdmin: Boolean(localStorage.getItem('adminToken')),
});

const sortByOrder = (items = []) =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const sortByDateDesc = (items = [], key = 'startDate') =>
  [...items].sort((a, b) => new Date(b?.[key] || 0) - new Date(a?.[key] || 0));

const groupSkills = (items = []) =>
  items.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

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
      experience: sortByDateDesc(payload.experience),
      education: sortByDateDesc(payload.education),
      certificates: payload.certificates ?? [],
      achievements: payload.achievements ?? [],
      loading: false,
    });
  },

  init: async () => {
    set({ loading: true });

    try {
      const results = await Promise.allSettled([
        api.getProfile(),
        api.getProjects(),
        api.getSkills(),
        api.getExperience(),
        api.getEducation(),
        api.getCertificates(),
        api.getAchievements(),
      ]);

      const [profile, projects, skills, experience, education, certificates, achievements] =
        results.map((result) => (result.status === 'fulfilled' ? result.value.data : null));

      get().hydrateData({
        profile,
        projects: projects ?? [],
        skills: skills ?? [],
        experience: experience ?? [],
        education: education ?? [],
        certificates: certificates ?? [],
        achievements: achievements ?? [],
      });
    } catch (error) {
      console.error('Failed to initialize frontend store:', error);
      set({ loading: false });
    }
  },

  fetchAllData: async () => {
    await get().init();
  },
}));
