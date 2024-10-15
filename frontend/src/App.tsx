import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { store } from './redux/store';
import { RootState } from './redux/store';
import { logout } from './redux/authSlice';
import { isTokenExpired } from './utils/authUtils';
import AppRoutes from './routes/routes';
import { JwtPayload, jwtDecode } from 'jwt-decode';

const App = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token is expired on initial load
    if (isTokenExpired(token)) {
      dispatch(logout());
      navigate('/login'); // Redirect to login if token is expired
    }

    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const expirationTime = decodedToken.exp ? decodedToken.exp * 1000 - Date.now() : 0;

      // Set a timeout to logout if the token expires
      if (expirationTime > 0) {
        const timeout = setTimeout(() => {
          dispatch(logout());
          navigate('/login');
        }, expirationTime);

        return () => clearTimeout(timeout);
      }
    }
  }, [token, dispatch, navigate]);

  return (
    <div>
      <AppRoutes /> {/* Render the routes for your app */}
    </div>
  );
};

export default App;