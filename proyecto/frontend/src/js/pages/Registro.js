import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registro } from '../../services/authService';

const obtenerMensajeError = (error, fallback) => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') {
      return data;
    }
    if (data.message) {
      return data.message;
    }
  }
  return fallback;
};

export const useRegistro = () => {
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombreNegocio: '',
    tipoRubro: '',
    templateId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarPaso1 = () => {
    if (!form.email || !form.password) {
      setError('Completa email y clave para continuar.');
      return false;
    }
    return true;
  };

  const avanzar = (event) => {
    event.preventDefault();
    setError('');
    if (validarPaso1()) {
      setPaso(2);
    }
  };

  const retroceder = () => {
    setPaso(1);
  };

  const manejarSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.nombreNegocio || !form.tipoRubro) {
      setError('Completa nombre del negocio y rubro.');
      return;
    }

    setLoading(true);

    try {
      const data = await registro(form);
      if (data?.jwt) {
        navigate('/editor', { replace: true });
      } else {
        navigate('/login', { replace: true, state: { registroOK: true } });
      }
    } catch (err) {
      setError(obtenerMensajeError(err, 'No pudimos crear la cuenta.'));
    } finally {
      setLoading(false);
    }
  };

  return {
    paso,
    form,
    error,
    loading,
    manejarCambio,
    avanzar,
    retroceder,
    manejarSubmit
  };
};
