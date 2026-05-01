import { useLocation } from 'react-router-dom';
import { getToken } from '../../services/authStorage';

export const useProtectedRoute = () => {
  const location = useLocation();
  const token = getToken();

  return {
    location,
    isAuthed: Boolean(token)
  };
};
