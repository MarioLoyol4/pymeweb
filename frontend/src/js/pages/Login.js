import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

const obtenerMensajeError = (error) => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') {
      return data;
    }
    if (data.message) {
      return data.message;
    }
  }
  return 'No pudimos iniciar sesion. Revisa tus credenciales.';
};

export const useLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/editor';
  const registroOK = Boolean(location.state?.registroOK);

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    error,
    loading,
    registroOK,
    manejarCambio,
    manejarSubmit
  };
};
