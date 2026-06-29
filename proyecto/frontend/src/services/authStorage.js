const TOKEN_KEY = 'simplipyme_token';
const NEGOCIO_KEY = 'simplipyme_negocio_id';
const SLUG_KEY = 'simplipyme_negocio_slug';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // No-op
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // No-op
  }
};

export const getNegocioId = () => {
  try {
    return localStorage.getItem(NEGOCIO_KEY);
  } catch {
    return null;
  }
};

export const setNegocioId = (negocioId) => {
  if (negocioId == null) {
    return;
  }

  try {
    localStorage.setItem(NEGOCIO_KEY, String(negocioId));
  } catch {
    // No-op
  }
};

export const clearNegocioId = () => {
  try {
    localStorage.removeItem(NEGOCIO_KEY);
  } catch {
    // No-op
  }
};

export const getSlug = () => {
  try {
    return localStorage.getItem(SLUG_KEY);
  } catch {
    return null;
  }
};

export const setSlug = (slug) => {
  if (!slug) return;
  try {
    localStorage.setItem(SLUG_KEY, slug);
  } catch {
    // No-op
  }
};

export const clearSlug = () => {
  try {
    localStorage.removeItem(SLUG_KEY);
  } catch {
    // No-op
  }
};