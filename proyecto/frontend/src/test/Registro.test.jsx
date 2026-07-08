import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useRegistro } from '../js/pages/Registro.js';
import Registro from '../pages/Registro.jsx';

// Mock del hook de control de estado de registro
vi.mock('../js/pages/Registro.js', () => ({
  useRegistro: vi.fn(),
}));

describe('Registro Component - Test de Cobertura Completa', () => {
  // Objeto con el estado inicial base para simular el comportamiento del Hook
  const mockHookBase = {
    paso: 1,
    form: { email: '', password: '', nombreNegocio: '', tipoRubro: '' },
    error: null,
    loading: false,
    manejarCambio: vi.fn(),
    avanzar: vi.fn((e) => e?.preventDefault()),
    retroceder: vi.fn(),
    manejarSubmit: vi.fn((e) => e?.preventDefault()),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper para renderizar con el enrutador necesario debido a los componentes <Link>
  const renderConRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('debe renderizar la sección Hero con textos y características informativas', () => {
    useRegistro.mockReturnValue(mockHookBase);
    renderConRouter(<Registro />);

    expect(screen.getByText('Pymeweb')).toBeDefined();
    expect(screen.getByText('Abre tu página web en solo dos pasos.')).toBeDefined();
    expect(screen.getByText('Registro guiado')).toBeDefined();
    expect(screen.getByText('Plantillas inteligentes')).toBeDefined();
  });

  it('debe renderizar el Paso 1 (Credenciales) con sus respectivos inputs', () => {
    useRegistro.mockReturnValue({
      ...mockHookBase,
      paso: 1,
      form: { ...mockHookBase.form, email: 'test@correo.com' }
    });
    renderConRouter(<Registro />);

    // Verificar que los badges reflejen el paso activo
    expect(screen.getByText('Paso 1 · Credenciales')).toBeDefined();
    
    // Verificar inputs mediante sus valores iniciales
    const inputEmail = screen.getByDisplayValue('test@correo.com');
    expect(inputEmail).toBeDefined();
    expect(screen.queryByLabelText(/Contraseña/i)).toBeDefined();

    // Comprobar que elementos específicos del Paso 2 NO se muestren aún
    expect(screen.queryByLabelText(/Nombre del negocio/i)).toBeNull();
  });

  it('debe activar manejarCambio al escribir en los inputs del Paso 1', () => {
    const manejarCambioMock = vi.fn();
    useRegistro.mockReturnValue({
      ...mockHookBase,
      paso: 1,
      manejarCambio: manejarCambioMock,
    });
    renderConRouter(<Registro />);

    const inputEmail = screen.getByPlaceholderText('ejemplo@gmail.com');
    fireEvent.change(inputEmail, { target: { value: 'nuevo@correo.com' } });
    
    expect(manejarCambioMock).toHaveBeenCalled();
  });

  it('debe invocar la acción avanzar al enviar el formulario en el Paso 1', () => {
    const avanzarMock = vi.fn((e) => e.preventDefault());
    useRegistro.mockReturnValue({
      ...mockHookBase,
      paso: 1,
      avanzar: avanzarMock,
    });
    const { container } = renderConRouter(<Registro />);

    // Corregido: Disparamos el submit directamente sobre la etiqueta form
    const formulario = container.querySelector('form');
    fireEvent.submit(formulario);

    expect(avanzarMock).toHaveBeenCalled();
  });

  it('debe renderizar el Paso 2 (Negocio) con selectores y la caja de resumen', () => {
    useRegistro.mockReturnValue({
      ...mockHookBase,
      paso: 2,
      form: { email: '', password: '', nombreNegocio: 'Cafetería Central', tipoRubro: 'restaurante' }
    });
    renderConRouter(<Registro />);

    expect(screen.getByText('Paso 2 · Negocio')).toBeDefined();
    expect(screen.getByDisplayValue('Cafetería Central')).toBeDefined();
    expect(screen.getByDisplayValue('Restaurante')).toBeDefined();

    // Validar el cuadro resumen de datos dinámicos
    expect(screen.getByText('Resumen de tu sitio')).toBeDefined();
    expect(screen.getByText('Cafetería Central')).toBeDefined();
    expect(screen.getByText('restaurante')).toBeDefined();
  });

  it('debe llamar a la acción retroceder al hacer clic en el botón Atrás del Paso 2', () => {
    const retrocederMock = vi.fn();
    useRegistro.mockReturnValue({
      ...mockHookBase,
      paso: 2,
      retroceder: retrocederMock,
    });
    renderConRouter(<Registro />);

    const btnAtras = screen.getByRole('button', { name: /Atrás/i });
    fireEvent.click(btnAtras);

    expect(retrocederMock).toHaveBeenCalled();
  });

  it('debe invocar manejarSubmit al enviar el formulario en el Paso 2', () => {
    const manejarSubmitMock = vi.fn((e) => e.preventDefault());
    useRegistro.mockReturnValue({
      ...mockHookBase,
      paso: 2,
      manejarSubmit: manejarSubmitMock,
    });
    const { container } = renderConRouter(<Registro />);

    // Corregido: Disparamos el submit directamente sobre la etiqueta form
    const formulario = container.querySelector('form');
    fireEvent.submit(formulario);

    expect(manejarSubmitMock).toHaveBeenCalled();
  });

  it('debe deshabilitar el botón y mostrar el texto Creando... cuando loading es verdadero', () => {
    useRegistro.mockReturnValue({
      ...mockHookBase,
      paso: 2,
      loading: true,
    });
    renderConRouter(<Registro />);

    const btnCrear = screen.getByRole('button', { name: /Creando\.\.\./i });
    expect(btnCrear).toBeDefined();
    expect(btnCrear.disabled).toBe(true);
  });

  it('debe renderizar la alerta de error si existe un mensaje en el estado', () => {
    useRegistro.mockReturnValue({
      ...mockHookBase,
      error: 'El correo electrónico ya se encuentra registrado.',
    });
    renderConRouter(<Registro />);

    const alertaError = screen.getByText('El correo electrónico ya se encuentra registrado.');
    expect(alertaError).toBeDefined();
    expect(alertaError.className).toContain('auth-alert error');
  });

  it('debe mostrar valores por defecto "Por definir" en el resumen si los campos están vacíos en Paso 2', () => {
    useRegistro.mockReturnValue({
      ...mockHookBase,
      paso: 2,
      form: { email: '', password: '', nombreNegocio: '', tipoRubro: '' }
    });
    renderConRouter(<Registro />);

    expect(screen.getAllByText('Por definir').length).toBe(2);
  });
});