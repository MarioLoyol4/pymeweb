import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login'; // Ajusta la ruta según tu estructura
import { useLogin } from '../js/pages/Login.js'; // Ajusta la ruta según tu estructura

// 1. Mockear el hook personalizado para controlar sus estados en cada test
jest.mock('../js/pages/Login.js', () => ({
  useLogin: jest.fn(),
}));

describe('Pruebas unitarias para el componente <Login />', () => {
  // Valores por defecto para el hook en cada prueba limpia
  const funcionesMock = {
    form: { email: '', password: '' },
    error: null,
    loading: false,
    registroOK: false,
    manejarCambio: jest.fn(),
    manejarSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLogin.mockReturnValue(funcionesMock);
  });

  test('Debería renderizar la estructura básica, textos de marketing y campos del formulario', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verificar textos del Hero (Marketing)
    expect(screen.getByText('SimpliPyme')).toBeInTheDocument();
    expect(screen.getByText('Tu panel listo para vender en minutos.')).toBeInTheDocument();

    // Verificar elementos del formulario
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar al editor/i })).toBeInTheDocument();
  });

  test('Debería mostrar el mensaje de éxito cuando "registroOK" es verdadero', () => {
    useLogin.mockReturnValue({
      ...funcionesMock,
      registroOK: true,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const alertaExito = screen.getByText(/Cuenta creada correctamente. Ahora puedes iniciar sesión./i);
    expect(alertaExito).toBeInTheDocument();
    expect(alertaExito).toHaveClass('success');
  });

  test('Debería mostrar un mensaje de error cuando "error" contiene un texto', () => {
    const mensajeError = 'Credenciales incorrectas';
    useLogin.mockReturnValue({
      ...funcionesMock,
      error: mensajeError,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const alertaError = screen.getByText(mensajeError);
    expect(alertaError).toBeInTheDocument();
    expect(alertaError).toHaveClass('error');
  });

  test('Debería deshabilitar el botón y cambiar el texto cuando "loading" es verdadero', () => {
    useLogin.mockReturnValue({
      ...funcionesMock,
      loading: true,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const boton = screen.getByRole('button', { name: /Ingresando.../i });
    expect(boton).toBeDisabled();
  });

  test('Debería llamar a "manejarCambio" cuando el usuario escribe en los inputs', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const inputEmail = screen.getByLabelText(/Correo electrónico/i);
    
    // Simular que el usuario escribe un correo electrónico
    fireEvent.change(inputEmail, { target: { value: 'test@correo.com' } });

    expect(funcionesMock.manejarCambio).toHaveBeenCalledTimes(1);
  });

  test('Debería llamar a "manejarSubmit" cuando se envía el formulario', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const botonSubmit = screen.getByRole('button', { name: /Entrar al editor/i });
    
    // Simular el clic / envío del formulario
    fireEvent.click(botonSubmit);

    expect(funcionesMock.manejarSubmit).toHaveBeenCalledTimes(1);
  });
});