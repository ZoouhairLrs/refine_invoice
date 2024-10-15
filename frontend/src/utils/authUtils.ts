import { JwtPayload, jwtDecode } from 'jwt-decode'

// Check if token is expired
export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  const decoded = jwtDecode<JwtPayload>(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp && decoded.exp < currentTime;
};
