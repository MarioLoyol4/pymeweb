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

      {/* Contenedor principal */}
      <div className="auth-container">

        {/* ================= HERO IZQUIERDO ================= */}
        <section className="auth-hero">

          <div className="brand-logo">
            <span className="logo-icon">📦</span>
            <strong>PymeWeb</strong>
          </div>

          <h1 className="hero-title">
            Tu panel listo para vender en minutos.
          </h1>
          <div className="hero-content-layout">
            <div className="hero-illustration-container">
              <img
                src="/imagen1jpg.jpg"
                alt="Registro PymeWeb"
                className="hero-image"
              />
            </div>

            <p className="hero-subtitle">
              Digitaliza tu negocio, administra tu página web y mantén toda la
              información de tu negocio actualizada desde un solo lugar.
            </p>
         </div>

          {/* Información adicional */}
          <div className="auth-hero-card">

            <div className="hero-feature">
              <strong>Editor visual</strong>
              <span>
                Modifica el contenido de tu sitio de manera sencilla sin
                conocimientos técnicos.
              </span>
            </div>

            <div className="hero-feature">
              <strong>Plantillas listas</strong>
              <span>
                Elige el estilo que mejor represente tu rubro.
              </span>
            </div>

            <div className="hero-feature">
              <strong>Actualización instantánea</strong>
              <span>
                Los cambios se reflejan inmediatamente en tu página web.
              </span>
            </div>

          </div>

        </section>

        {/* ================= FORMULARIO ================= */}
        <section className="auth-card">

          {/* Tabs */}
          <div className="auth-tabs">
            <button className="tab-button active">
              Iniciar sesión
            </button>

            <Link
              to="/registro"
              className="tab-button text-muted-tab"
            >
              Registrarse
            </Link>
          </div>

          <div className="auth-card-header">
            <h2>Bienvenido nuevamente</h2>
            <p>
              Ingresa con el correo electrónico asociado a tu cuenta para
              acceder al panel de administración.
            </p>
          </div>

          {registroOK && (
            <div className="auth-alert success">
              Cuenta creada correctamente. Ahora puedes iniciar sesión.
            </div>
          )}

          {error && (
            <div className="auth-alert error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={manejarSubmit}
          >

            {/* Correo */}
            <div className="input-group">
              <label
                className="auth-label"
                htmlFor="email"
              >
                Correo electrónico
              </label>

              <div className="input-with-icon">
                <span className="input-icon">👤</span>

                <input
                  className="auth-input"
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={manejarCambio}
                  placeholder="ejemplo@gmail.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="input-group">
              <label
                className="auth-label"
                htmlFor="password"
              >
                Contraseña
              </label>

              <div className="input-with-icon">
                <span className="input-icon">🔒</span>

                <input
                  className="auth-input"
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={manejarCambio}
                  placeholder="***************"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              className="auth-button btn-primary-orange"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Entrar al editor'}
            </button>

          </form>

          <div className="auth-footer">
            <span>¿Aún no tienes una cuenta?</span>

            <Link
              className="auth-link"
              to="/registro"
            >
              Crear cuenta
            </Link>
          </div>

        </section>

      </div>
    </div>
  );
};

export default Login;