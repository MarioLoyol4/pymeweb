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

      <div className="auth-container">

        {/* ================= HERO ================= */}
        <section className="auth-hero">

          <div className="brand-logo">
            <img src="/logo.png" alt="Logo PymeWeb" className="logo-icon"/>
            <strong>PymeWeb</strong>
          </div>

          <h1 className="hero-title">
            Abre tu página web en solo dos pasos.
          </h1>

          <div className="hero-content-layout">
            <div className="hero-illustration-container">
              <img
                src="/1.png"
                alt="Registro Pymeweb"
                className="hero-image"
              />
            </div>

            <p className="hero-subtitle">
              Crea tu cuenta, selecciona el rubro de tu negocio y comienza a
              administrar tu sitio web desde un editor simple, rápido y seguro.
            </p>
         </div>

          <div className="auth-hero-card">

            <div className="hero-feature">
              <strong>Registro guiado</strong>
              <span>
                Completa la información paso a paso para crear tu sitio.
              </span>
            </div>

            <div className="hero-feature">
              <strong>Plantillas inteligentes</strong>
              <span>
                Escoge un rubro y comienza con una estructura prediseñada.
              </span>
            </div>

            <div className="hero-feature">
              <strong>Datos centralizados</strong>
              <span>
                Toda la información de tu negocio organizada desde el primer día.
              </span>
            </div>

          </div>

        </section>

        {/* ================= FORMULARIO ================= */}

        <section className="auth-card">

          <div className="auth-tabs">
            <Link
              to="/login"
              className="tab-button text-muted-tab"
            >
              Iniciar sesión
            </Link>

            <button className="tab-button active">
              Registrarse
            </button>
          </div>

          <div className="auth-card-header">
            <h2>Crear cuenta</h2>
            <p>
              Completa el registro para activar tu panel de administración y
              comenzar a personalizar tu sitio web.
            </p>
          </div>

          <div className="auth-steps-container">

            <span className={`step-badge ${paso === 1 ? 'step-active' : ''}`}>
              Paso 1 · Credenciales
            </span>

            <div className="step-line"></div>

            <span className={`step-badge ${paso === 2 ? 'step-active' : ''}`}>
              Paso 2 · Negocio
            </span>

          </div>

          {error && (
            <div className="auth-alert error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={paso === 1 ? avanzar : manejarSubmit}
          >

            {paso === 1 ? (

              <>

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
                      placeholder="Crea una contraseña segura"
                      autoComplete="new-password"
                      required
                    />

                  </div>

                </div>

                <div className="auth-actions-row">

                  <button
                    className="auth-button btn-primary-orange"
                    type="submit"
                  >
                    Continuar
                  </button>

                </div>

              </>

            ) : (

              <>

                <div className="input-group">

                  <label
                    className="auth-label"
                    htmlFor="nombreNegocio"
                  >
                    Nombre del negocio
                  </label>

                  <div className="input-with-icon">

                    <span className="input-icon">🏢</span>

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

                  </div>

                </div>

                <div className="input-group">

                  <label
                    className="auth-label"
                    htmlFor="tipoRubro"
                  >
                    Tipo de rubro
                  </label>

                  <div className="input-with-icon">

                    <span className="input-icon">🏷️</span>

                    <select
                      className="auth-select"
                      id="tipoRubro"
                      name="tipoRubro"
                      value={form.tipoRubro}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="" disabled>
                        Selecciona un rubro
                      </option>
                      <option value="abogados">Abogados</option>
                      <option value="mascotas">Mascotas</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="generico">Comenzar en blanco</option>
                    </select>

                  </div>

                </div>

                <div className="auth-summary-box">

                  <p>
                    <strong>Resumen de tu sitio</strong>
                  </p>

                  <ul>
                    <li>
                      Negocio:
                      <span> {form.nombreNegocio || ' Por definir'}</span>
                    </li>

                    <li>
                      Rubro:
                      <span> {form.tipoRubro || ' Por definir'}</span>
                    </li>
                  </ul>

                </div>

                <div className="auth-actions-row split">

                  <button
                    className="auth-button btn-secondary-back"
                    type="button"
                    onClick={retroceder}
                  >
                    Atrás
                  </button>

                  <button
                    className="auth-button btn-primary-orange"
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

            <Link
              className="auth-link"
              to="/login"
            >
              Inicia sesión
            </Link>

          </div>

        </section>

      </div>
    </div>
  );
};

export default Registro;