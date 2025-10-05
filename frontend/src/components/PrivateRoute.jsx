// PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Correct path

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading fallback while checking auth
  if (loading) return <p>Checking authentication...</p>;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
