import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useParams } from 'react-router-dom';
import { usePaginaPublica } from '../js/pages/PaginaPublica.js';
import PaginaPublica from '../pages/PaginaPublica.jsx';

// Mocks de dependencias
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('../js/pages/PaginaPublica.js', () => ({
  usePaginaPublica: vi.fn(),
}));

// Mock del subcomponente pasándole los props para poder inspeccionarlos en los tests
vi.mock('../components/RenderizadorSeccion', () => ({
  RenderizadorSeccion: ({ tipoSeccion, contenidoJson, logoContenidoJson }) => (
    <div data-testid="renderizador-seccion" data-tipo={tipoSeccion}>
      <span>Seccion: {tipoSeccion}</span>
      {contenidoJson && <span>Contenido: {contenidoJson.texto}</span>}
      {logoContenidoJson && <span>Logo Combinado: {logoContenidoJson.url}</span>}
    </div>
  ),
}));

describe('PaginaPublica Component - Test de Cobertura Completa', () => {
  const mockIdNegocio = '999';

  const mockHookBase = {
    seccionesOrdenadas: [
      { idSeccion: '1', tipoSeccion: 'LOGO', contenidoJson: { texto: 'Mi Logo Base' } },
      { idSeccion: '2', tipoSeccion: 'BARRA_MENU', contenidoJson: { texto: 'Menu Base' } },
      { idSeccion: '3', tipoSeccion: 'HERO', contenidoJson: { texto: 'Bienvenidos' } }
    ],
    logoSeccion: { idSeccion: '1', contenidoJson: { url: 'logo.png' } },
    barraMenuSeccion: { contenidoJson: { texto: 'Menu Combinado' } },
    combinarLogoEnMenu: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ idNegocio: mockIdNegocio });
  });

  it('debe renderizar todas las secciones ordenadas si combinarLogoEnMenu es falso', () => {
    usePaginaPublica.mockReturnValue(mockHookBase);
    
    render(<PaginaPublica />);

    // Verifica que se llamara al hook con el ID de la URL correcto
    expect(usePaginaPublica).toHaveBeenCalledWith(mockIdNegocio);

    // Debe renderizar el Logo separado, el Menú y el Hero (3 elementos)
    const componentes = screen.getAllByTestId('renderizador-seccion');
    expect(componentes.length).toBe(3);
    
    expect(screen.getByText('Seccion: LOGO')).toBeDefined();
    expect(screen.getByText('Seccion: BARRA_MENU')).toBeDefined();
    expect(screen.getByText('Seccion: HERO')).toBeDefined();
  });

  it('debe omitir la sección LOGO e inyectar el logo en BARRA_MENU si combinarLogoEnMenu es verdadero', () => {
    usePaginaPublica.mockReturnValue({
      ...mockHookBase,
      combinarLogoEnMenu: true,
    });

    render(<PaginaPublica />);

    // Al estar combinado, la sección LOGO independiente retorna null, reduciendo la lista a 2 elementos
    const componentes = screen.getAllByTestId('renderizador-seccion');
    expect(componentes.length).toBe(2);
    
    // El logo independiente no debe existir
    expect(screen.queryByText('Seccion: LOGO')).toBeNull();

    // Verificamos que la sección BARRA_MENU haya recibido los datos combinados
    expect(screen.getByText('Seccion: BARRA_MENU')).toBeDefined();
    expect(screen.getByText('Contenido: Menu Combinado')).toBeDefined();
    expect(screen.getByText('Logo Combinado: logo.png')).toBeDefined();
  });
});