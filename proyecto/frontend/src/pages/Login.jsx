import React from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../js/pages/Login.js';
import '../styles/pages/Auth.css';

const Login = () => {
  const {
    form,
    error,
    loading,
    registroOK,
    manejarCambio,
    manejarSubmit
  } = useLogin();

  return (
    <div className="auth-page">
      <div className="auth-orb orb-one" />
      <div className="auth-orb orb-two" />
      <div className="auth-shell">
        <section className="auth-hero">
          <span className="auth-kicker">PymeWeb</span>
          <h1>Tu panel listo para vender en minutos.</h1>
          <p>
            Ingresa para editar tu sitio, cambiar secciones y mantener tu pyme
            siempre actualizada.
          </p>
          <div className="auth-hero-card">
            <div>
              <strong>Editor visual</strong>
              <span>Arrastra secciones y guarda al instante.</span>
            </div>
            <div>
              <strong>Plantillas listas</strong>
              <span>Elige el estilo que mejor represente tu rubro.</span>
            </div>
          </div>
        </section>
        <section className="auth-card">
          <div className="auth-card-header">
            <h2>Iniciar sesion</h2>
            <p>Accede con el email de tu cuenta.</p>
          </div>
          {registroOK && (
            <div className="auth-alert success">
              Cuenta creada. Ahora puedes iniciar sesion.
            </div>
          )}
          {error && <div className="auth-alert error">{error}</div>}
          <form className="auth-form" onSubmit={manejarSubmit}>
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
              placeholder="Tu clave segura"
              autoComplete="current-password"
              required
            />
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Entrar al editor'}
            </button>
          </form>
          <div className="auth-footer">
            <span>¿Aun no tienes cuenta?</span>
            <Link className="auth-link" to="/registro">
              Crear cuenta
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
