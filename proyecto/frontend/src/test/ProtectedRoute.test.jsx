import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Navigate } from 'react-router-dom';
import { useProtectedRoute } from '../js/components/ProtectedRoute.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// Mock de las dependencias
vi.mock('react-router-dom', () => ({
  // Un mock simple que guarda las llamadas sin interferir en el ciclo de React
  Navigate: vi.fn(({ to, replace, state }) => (
    <div 
      data-testid="mock-navigate" 
      data-to={to} 
      data-replace={replace ? "true" : "false"}
      data-state={JSON.stringify(state)}
    >
      Redireccionando...
    </div>
  )),
}));

vi.mock('../js/components/ProtectedRoute.js', () => ({
  useProtectedRoute: vi.fn(),
}));

describe('ProtectedRoute Component - Test de Cobertura Completa', () => {
  const mockLocation = { pathname: '/dashboard' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar y permitir el acceso a los componentes hijos (children) si el usuario está autenticado', () => {
    useProtectedRoute.mockReturnValue({
      isAuthed: true,
      location: mockLocation,
    });

    render(
      <ProtectedRoute>
        <div data-testid="contenido-protegido">Bienvenido al Panel de Control</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('contenido-protegido')).toBeDefined();
    expect(screen.getByText('Bienvenido al Panel de Control')).toBeDefined();
    expect(screen.queryByTestId('mock-navigate')).toBeNull();
  });

  it('debe redirigir a /login y guardar el estado de la ubicación previa si el usuario NO está autenticado', () => {
    useProtectedRoute.mockReturnValue({
      isAuthed: false,
      location: mockLocation,
    });

    render(
      <ProtectedRoute>
        <div data-testid="contenido-protegido">Contenido Privado</div>
      </ProtectedRoute>
    );

    // 1. Validar que el contenido privado NO se renderice
    expect(screen.queryByTestId('contenido-protegido')).toBeNull();

    // 2. Validar que el componente Navigate haya sido llamado exactamente una vez
    expect(Navigate).toHaveBeenCalledOnce();

    // 3. Inspeccionar el primer argumento (las props) de la primera llamada de manera manual y segura
    const primerArgumentoProps = Navigate.mock.calls[0][0];
    expect(primerArgumentoProps.to).toBe('/login');
    expect(primerArgumentoProps.replace).toBe(true);
    expect(primerArgumentoProps.state).toEqual({ from: mockLocation });

    // 4. Verificación doble mediante el DOM virtual (Garantía extra)
    const elementoRedireccion = screen.getByTestId('mock-navigate');
    expect(elementoRedireccion.getAttribute('data-to')).toBe('/login');
    expect(elementoRedireccion.getAttribute('data-replace')).toBe('true');
    expect(JSON.parse(elementoRedireccion.getAttribute('data-state'))).toEqual({ from: mockLocation });
  });
});