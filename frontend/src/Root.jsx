import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import App from './App';
import AdminLayout from './components/admin/adminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AddProject from './sections/admin/addProject';
import AchievementManagement from './sections/admin/AchievementManagement';
import CertificateManagement from './sections/admin/CertificateManagement';
import JourneyManagement from './sections/admin/JourneyManagement';
import Messages from './sections/admin/Messages';
import ProfileSettings from './sections/admin/ProfileSettings';
import ProjectManagement from './sections/admin/ProjectManagement';
import SkillManagement from './sections/admin/SkillManagement';
import Login from './sections/auth/Login';
import { useStore } from './store/useStore';

export default function Root() {
  const init = useStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    document.body.classList.add('bg-[#020617]', 'text-slate-100', 'antialiased', 'overflow-x-hidden');

    return () => {
      document.documentElement.classList.remove('scroll-smooth');
      document.body.classList.remove('bg-[#020617]', 'text-slate-100', 'antialiased', 'overflow-x-hidden');
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/projects" replace />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="projects/new" element={<AddProject />} />
          <Route path="projects/edit/:id" element={<AddProject isEdit />} />
          <Route path="skills" element={<SkillManagement />} />
          <Route path="journey" element={<JourneyManagement />} />
          <Route path="credentials" element={<CertificateManagement />} />
          <Route path="achievements" element={<AchievementManagement />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
