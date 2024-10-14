import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { isTokenExpired } from '../utils/authUtils';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return children;
};

export default ProtectedRoute;
