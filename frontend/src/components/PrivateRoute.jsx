import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Checking authentication...</p>;
  if (!user) return <Navigate to="/login" />;

  // Role-based protection (e.g., only admin can access /users)
  if (role && user.role !== role) {
    return <Navigate to="/transactions" />;
  }

  return children;
};

export default PrivateRoute;
