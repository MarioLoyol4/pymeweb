import React from 'react';
import { Link } from 'react-router-dom';
import { useRegistro } from '../js/pages/Registro.js';
import '../styles/pages/Auth.css';

const Registro = () => {
  const {
    paso,
    form,
    error,
    loading,
    manejarCambio,
    avanzar,
    retroceder,
    manejarSubmit
  } = useRegistro();

  return (
    <div className="auth-page">
      <div className="auth-orb orb-one" />
      <div className="auth-orb orb-two" />
      <div className="auth-shell">
        <section className="auth-hero">
          <span className="auth-kicker">PymeWeb</span>
          <h1>Abre tu pagina en dos pasos.</h1>
          <p>
            Crea tu cuenta, elige el estilo y empieza a editar tu sitio sin
            esperas.
          </p>
          <div className="auth-hero-card">
            <div>
              <strong>Template guiado</strong>
              <span>Selecciona el rubro y la plantilla inicial.</span>
            </div>
            <div>
              <strong>Datos centralizados</strong>
              <span>Tu negocio listo para crecer desde el primer dia.</span>
            </div>
          </div>
        </section>
        <section className="auth-card">
          <div className="auth-card-header">
            <h2>Crear cuenta</h2>
            <p>Completa el registro para activar tu editor.</p>
          </div>
          <div className="auth-steps">
            <span className={`auth-step ${paso === 1 ? 'active' : ''}`}>
              Paso 1
            </span>
            <span className={`auth-step ${paso === 2 ? 'active' : ''}`}>
              Paso 2
            </span>
          </div>
          {error && <div className="auth-alert error">{error}</div>}
          <form className="auth-form" onSubmit={paso === 1 ? avanzar : manejarSubmit}>
            {paso === 1 ? (
              <>
                <label className="auth-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="auth-input"
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={manejarCambio}
                  placeholder="usuario@ejemplo.com"
                  autoComplete="email"
                  required
                />
                <label className="auth-label" htmlFor="password">
                  Contrasena
                </label>
                <input
                  className="auth-input"
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={manejarCambio}
                  placeholder="Crea una clave segura"
                  autoComplete="new-password"
                  required
                />
                <div className="auth-actions">
                  <button className="auth-button" type="submit">
                    Continuar
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="auth-label" htmlFor="nombreNegocio">
                  Nombre del negocio
                </label>
                <input
                  className="auth-input"
                  id="nombreNegocio"
                  name="nombreNegocio"
                  type="text"
                  value={form.nombreNegocio}
                  onChange={manejarCambio}
                  placeholder="Mi Pyme SpA"
                  required
                />
                <label className="auth-label" htmlFor="tipoRubro">
                  Tipo de rubro
                </label>
                <input
                  className="auth-input"
                  id="tipoRubro"
                  name="tipoRubro"
                  type="text"
                  value={form.tipoRubro}
                  onChange={manejarCambio}
                  placeholder="Restaurante, mascotas, abogados..."
                  required
                />
                <label className="auth-label" htmlFor="templateId">
                  Template inicial
                </label>
                <select
                  className="auth-select"
                  id="templateId"
                  name="templateId"
                  value={form.templateId}
                  onChange={manejarCambio}
                >
                  <option value="classic">Classic (Abogados)</option>
                  <option value="modern">Modern (Mascotas)</option>
                  <option value="rustic">Rustic (Restaurante)</option>
                </select>
                <div className="auth-summary">
                  <span>Negocio: {form.nombreNegocio || 'Por definir'}</span>
                  <span>Rubro: {form.tipoRubro || 'Por definir'}</span>
                  <span>Template: {form.templateId}</span>
                </div>
                <div className="auth-actions">
                  <button className="auth-button secondary" type="button" onClick={retroceder}>
                    Atras
                  </button>
                  <button
                    className="auth-button"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : 'Crear cuenta'}
                  </button>
                </div>
              </>
            )}
          </form>
          <div className="auth-footer">
            <span>¿Ya tienes cuenta?</span>
            <Link className="auth-link" to="/login">
              Inicia sesion
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Registro;
