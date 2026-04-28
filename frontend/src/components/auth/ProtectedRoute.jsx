import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function ProtectedRoute({ children }) {
  const token = useStore((state) => state.token);

  if (!token) {
    // Redirect to login if no token is found in Zustand/LocalStorage
    return <Navigate to="/login" replace />;
  }

  return children;
}
