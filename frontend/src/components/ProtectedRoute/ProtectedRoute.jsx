import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Don't redirect while the token is being verified on mount
  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
