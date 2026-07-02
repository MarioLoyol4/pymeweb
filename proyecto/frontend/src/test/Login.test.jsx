import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import Login from '../pages/Login.jsx';
import { useLogin } from '../js/pages/Login.js';

vi.mock('../js/pages/Login.js', () => ({
    useLogin: vi.fn()
}));

describe('Pruebas Unitarias para el Componente Login', () => {
  // Funciones mock de espionaje para simular las acciones del usuario
  const manejarCambioMock = vi.fn();
  const manejarSubmitMock = vi.fn(e => e.preventDefault());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper para renderizar el componente envuelto en un Router (necesario por el uso de <Link>)
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  };

  test('Debería renderizar correctamente el formulario con sus campos vacíos', () => {
    // Definimos el estado inicial simulado
    useLogin.mockReturnValue({
      form: { email: '', password: '' },
      error: null,
      loading: false,
      registroOK: false,
      manejarCambio: manejarCambioMock,
      manejarSubmit: manejarSubmitMock
    });

    renderComponent();

    // Verificar textos del Hero
    expect(screen.getByText('Tu panel listo para vender en minutos.')).toBeInTheDocument();
    
    // Verificar que los inputs existan
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.value).toBe('');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.value).toBe('');

    // Verificar botón
    expect(screen.getByRole('button', { name: /entrar al editor/i })).toBeInTheDocument();
  });

  test('Debería mostrar un mensaje de éxito cuando registroOK es verdadero', () => {
    useLogin.mockReturnValue({
      form: { email: '', password: '' },
      error: null,
      loading: false,
      registroOK: true, // <-- Activamos la alerta
      manejarCambio: manejarCambioMock,
      manejarSubmit: manejarSubmitMock
    });

    renderComponent();

    const alertaExito = screen.getByText(/cuenta creada correctamente/i);
    expect(alertaExito).toBeInTheDocument();
    expect(alertaExito).toHaveClass('auth-alert success');
  });

  test('Debería mostrar un mensaje de error cuando la API falla', () => {
    useLogin.mockReturnValue({
      form: { email: 'test@error.com', password: '123' },
      error: 'Credenciales inválidas', // <-- Activamos el error
      loading: false,
      registroOK: false,
      manejarCambio: manejarCambioMock,
      manejarSubmit: manejarSubmitMock
    });

    renderComponent();

    const alertaError = screen.getByText('Credenciales inválidas');
    expect(alertaError).toBeInTheDocument();
    expect(alertaError).toHaveClass('auth-alert error');
  });

  test('Debería deshabilitar el botón y cambiar el texto cuando está en estado de carga (loading)', () => {
    useLogin.mockReturnValue({
      form: { email: 'ejemplo@gmail.com', password: 'password123' },
      error: null,
      loading: true, // <-- Activamos el spinner/loading
      registroOK: false,
      manejarCambio: manejarCambioMock,
      manejarSubmit: manejarSubmitMock
    });

    renderComponent();

    const botonSubmit = screen.getByRole('button', {
    name: /ingresando/i
  });
    expect(botonSubmit).toBeDisabled();
    expect(botonSubmit).toHaveTextContent('Ingresando...');
  });

  test('Debería llamar a manejarCambio cuando el usuario escribe en los inputs', () => {
    useLogin.mockReturnValue({
      form: { email: '', password: '' },
      error: null,
      loading: false,
      registroOK: false,
      manejarCambio: manejarCambioMock,
      manejarSubmit: manejarSubmitMock
    });

    renderComponent();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    
    // Simulamos que el usuario escribe un correo
    fireEvent.change(emailInput, { target: { value: 'usuario@pyme.com' } });

    // Verificamos que el hook se entere del cambio
    expect(manejarCambioMock).toHaveBeenCalledTimes(1);
  });

  test('Debería llamar a manejarSubmit al enviar el formulario', () => {
    useLogin.mockReturnValue({
      form: { email: 'usuario@pyme.com', password: 'password123' },
      error: null,
      loading: false,
      registroOK: false,
      manejarCambio: manejarCambioMock,
      manejarSubmit: manejarSubmitMock
    });

    renderComponent();

    const botonSubmit = screen.getByRole('button', { name: /entrar al editor/i });
    
    // Simulamos el click/submit
    fireEvent.click(botonSubmit);

    expect(manejarSubmitMock).toHaveBeenCalledTimes(1);
  });
});