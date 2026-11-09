import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import App from './App';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useStore } from './store/useStore';

const AdminLayout = lazy(() => import('./components/admin/adminLayout'));
const AddProject = lazy(() => import('./sections/admin/addProject'));
const AchievementManagement = lazy(() => import('./sections/admin/AchievementManagement'));
const CertificateManagement = lazy(() => import('./sections/admin/CertificateManagement'));
const JourneyManagement = lazy(() => import('./sections/admin/JourneyManagement'));
const Messages = lazy(() => import('./sections/admin/Messages'));
const ProfileSettings = lazy(() => import('./sections/admin/ProfileSettings'));
const ProjectManagement = lazy(() => import('./sections/admin/ProjectManagement'));
const SkillManagement = lazy(() => import('./sections/admin/SkillManagement'));
const Login = lazy(() => import('./sections/auth/Login'));

function RouteLoading() {
  return <div className="min-h-screen animate-pulse bg-[#090d12]" />;
}

export default function Root() {
  const init = useStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    document.body.classList.add('bg-[#08090c]', 'text-slate-100', 'antialiased', 'overflow-x-hidden');

    return () => {
      document.documentElement.classList.remove('scroll-smooth');
      document.body.classList.remove('bg-[#08090c]', 'text-slate-100', 'antialiased', 'overflow-x-hidden');
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Suspense fallback={<RouteLoading />}><Login /></Suspense>} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<RouteLoading />}>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </Suspense>
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
