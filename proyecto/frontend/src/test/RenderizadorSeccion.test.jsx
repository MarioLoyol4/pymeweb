import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolverRenderizadoSeccion } from '../js/components/RenderizadorSeccion.js';
import { RenderizadorSeccion } from '../components/RenderizadorSeccion.jsx'; // Ajusta la ruta si es necesario

// Mock de la función utilitaria que resuelve el componente
vi.mock('../js/components/RenderizadorSeccion.js', () => ({
  resolverRenderizadoSeccion: vi.fn(),
}));

// Un componente Mock ficticio para simular lo que resolvería la función utilitaria
const ComponenteMockFicticio = ({ contenido }) => (
  <div data-testid="componente-interno">
    <h1>{contenido?.titulo || 'Sin Titulo'}</h1>
  </div>
);

describe('RenderizadorSeccion Component - Test de Cobertura Completa', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar null si resolverRenderizadoSeccion no devuelve un Componente válido', () => {
    // Simular que el resolvedor no encuentra un componente que coincida con el tipo
    resolverRenderizadoSeccion.mockReturnValue({
      Componente: null,
      props: {},
    });

    const { container } = render(
      <RenderizadorSeccion 
        tipoSeccion="TIPO_INEXISTENTE" 
        contenidoJson={{}} 
      />
    );

    // Debe renderizar un DOM completamente vacío
    expect(container.firstChild).toBeNull();
  });

  it('debe mapear correctamente las variables CSS cuando se proveen colores personalizados', () => {
    const mockContenido = {
      titulo: 'Sección con Colores',
      colores: {
        fondo: '#111111',
        textoTitulo: '#222222',
        textoSecundario: '#333333'
      }
    };

    resolverRenderizadoSeccion.mockReturnValue({
      Componente: ComponenteMockFicticio,
      props: { contenido: mockContenido },
    });

    const { container } = render(
      <RenderizadorSeccion 
        tipoSeccion="HERO" 
        contenidoJson={mockContenido} 
      />
    );

    // Verificar que el resolvedor de componentes fue llamado con los argumentos correctos
    expect(resolverRenderizadoSeccion).toHaveBeenCalledWith("HERO", mockContenido, null);

    // Verificar que el componente dinámico interno se renderizó de forma correcta
    expect(screen.getByTestId('componente-interno')).toBeDefined();
    expect(screen.getByText('Sección con Colores')).toBeDefined();

    // Validar la inyección precisa de las Custom Properties de CSS en el div contenedor
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv.className).toBe('seccion-wrapper-personalizada');
    expect(wrapperDiv.style.getPropertyValue('--color-fondo')).toBe('#111111');
    expect(wrapperDiv.style.getPropertyValue('--color-titulo')).toBe('#222222');
    expect(wrapperDiv.style.getPropertyValue('--color-texto')).toBe('#333333');
  });

  it('debe dejar las variables CSS como undefined si el objeto colores viene vacío o incompleto', () => {
    const mockContenidoSinColores = {
      titulo: 'Sección por Defecto'
      // colores ausente de forma adrede para probar la caída de condiciones por cortocircuito || {}
    };

    resolverRenderizadoSeccion.mockReturnValue({
      Componente: ComponenteMockFicticio,
      props: { contenido: mockContenidoSinColores },
    });

    const { container } = render(
      <RenderizadorSeccion 
        tipoSeccion="PRODUCTOS" 
        contenidoJson={mockContenidoSinColores} 
        logoContenidoJson={{ url: 'logo.png' }}
      />
    );

    // Verificar que se haya transferido el logoContenidoJson opcional
    expect(resolverRenderizadoSeccion).toHaveBeenCalledWith("PRODUCTOS", mockContenidoSinColores, { url: 'logo.png' });

    // Validar que no se rompa el renderizado y que las variables CSS no estén definidas (bajarán a cascada CSS global)
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv.style.getPropertyValue('--color-fondo')).toBe('');
    expect(wrapperDiv.style.getPropertyValue('--color-titulo')).toBe('');
    expect(wrapperDiv.style.getPropertyValue('--color-texto')).toBe('');
  });
});