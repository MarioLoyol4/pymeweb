import { jwtDecode } from 'jwt-decode';
import apiClient from './apiClient';
import {
  setToken,
  clearToken,
  getToken,
  setNegocioId,
  getNegocioId as getStoredNegocioId,
  clearNegocioId
} from './authStorage';

const normalizarToken = (token) => {
  if (!token) {
    return null;
  }

  const limpio = token.startsWith('Bearer ')
    ? token.slice(7).trim()
    : token;

  return limpio || null;
};

const extraerNegocioId = (token) => {
  try {
    const payload = jwtDecode(token);
    return (
      payload?.negocioId ??
      payload?.idNegocio ??
      payload?.negocio_id ??
      payload?.negocio?.id ??
      null
    );
  } catch {
    return null;
  }
};

const guardarSesion = (token) => {
  const tokenLimpio = normalizarToken(token);
  if (!tokenLimpio) {
    return null;
  }

  setToken(tokenLimpio);
  const negocioId = extraerNegocioId(tokenLimpio);
  if (negocioId != null) {
    setNegocioId(negocioId);
  }
  return negocioId;
};

export const login = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload);
  if (data?.jwt) {
    guardarSesion(data.jwt);
  }
  return data;
};

export const registro = async (payload) => {
  const { data } = await apiClient.post('/auth/registro', payload);
  if (data?.jwt) {
    guardarSesion(data.jwt);
  }
  return data;
};

export const getNegocioId = () => {
  const stored = getStoredNegocioId();
  if (stored) {
    return stored;
  }

  const token = normalizarToken(getToken());
  if (!token) {
    return null;
  }

  const negocioId = extraerNegocioId(token);
  if (negocioId != null) {
    setNegocioId(negocioId);
    return String(negocioId);
  }

  return null;
};

export const logout = () => {
  clearToken();
  clearNegocioId();
};
