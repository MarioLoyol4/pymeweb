import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolverRenderizadoSeccion } from '../js/components/RenderizadorSeccion.js';
import { RenderizadorSeccion } from '../components/RenderizadorSeccion.jsx'; // <-- Ruta exacta real

// Mock de la dependencia que resuelve los componentes internos
vi.mock('../js/components/RenderizadorSeccion.js', () => ({
    resolverRenderizadoSeccion: vi.fn(),
}));

describe('RenderizadorSeccion Component - Cobertura del 100%', () => {
    const MockComponente = () => <div>Mock Component</div>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe retornar null si resolverRenderizadoSeccion no devuelve un Componente válido', () => {
        resolverRenderizadoSeccion.mockReturnValue({ Componente: null, props: {} });
        const { container } = render(<RenderizadorSeccion tipoSeccion="NADA" contenidoJson={{}} />);
        expect(container.firstChild).toBeNull();
    });

    it('debe mapear correctamente las variables CSS cuando se proveen colores y estilos de texto personalizados', () => {
        resolverRenderizadoSeccion.mockReturnValue({
            Componente: MockComponente,
            props: {
                contenido: {
                    colores: { fondo: '#111', textoTitulo: '#222', textoSecundario: '#333' },
                    estilosTexto: {
                        alineacionTitulo: 'center',
                        transformacionTitulo: 'uppercase',
                        alineacionTexto: 'justify',
                        transformacionTexto: 'lowercase'
                    }
                }
            }
        });

        const { container } = render(<RenderizadorSeccion tipoSeccion="BARRA_MENU" contenidoJson={{}} />);
        const wrapper = container.firstElementChild;

        expect(wrapper.className).toContain('tipo-BARRA_MENU');
        expect(wrapper.style.getPropertyValue('--color-fondo')).toBe('#111');
        expect(wrapper.style.getPropertyValue('--color-titulo')).toBe('#222');
        expect(wrapper.style.getPropertyValue('--color-texto')).toBe('#333');
    });

    it('debe calcular las variables CSS vacías si el objeto colores viene incompleto', () => {
        resolverRenderizadoSeccion.mockReturnValue({
            Componente: MockComponente,
            props: { contenido: { colores: {} } }
        });

        const { container } = render(<RenderizadorSeccion tipoSeccion="BARRA_MENU" contenidoJson={{}} />);
        const wrapper = container.firstElementChild;

        expect(wrapper.style.getPropertyValue('--color-fondo')).toBe('');
        expect(wrapper.style.getPropertyValue('--color-titulo')).toBe('');
        expect(wrapper.style.getPropertyValue('--color-texto')).toBe('');
    });

    it('debe calcular la altura personalizada en px si se provee un número o string numérico (Líneas 31-34)', () => {
        resolverRenderizadoSeccion.mockReturnValue({
            Componente: MockComponente,
            props: { contenido: { altura: 450 } }
        });

        const { container, rerender } = render(<RenderizadorSeccion tipoSeccion="HERO" contenidoJson={{}} />);
        expect(container.firstElementChild.style.getPropertyValue('--seccion-altura')).toBe('450px');

        resolverRenderizadoSeccion.mockReturnValue({
            Componente: MockComponente,
            props: { contenido: { altura: '20rem' } }
        });
        rerender(<RenderizadorSeccion tipoSeccion="HERO" contenidoJson={{}} />);
        expect(container.firstElementChild.style.getPropertyValue('--seccion-altura')).toBe('20rem');
    });

    it('debe procesar minAltura explícita correctamente (Líneas 40-41)', () => {
        resolverRenderizadoSeccion.mockReturnValue({
            Componente: MockComponente,
            props: { contenido: { minAltura: '500px' } }
        });

        const { container, rerender } = render(<RenderizadorSeccion tipoSeccion="HERO" contenidoJson={{}} />);
        expect(container.firstElementChild.style.getPropertyValue('--seccion-min-height')).toBe('500px');

        resolverRenderizadoSeccion.mockReturnValue({
            Componente: MockComponente,
            props: { contenido: { minAltura: 150 } }
        });
        rerender(<RenderizadorSeccion tipoSeccion="HERO" contenidoJson={{}} />);
        expect(container.firstElementChild.style.getPropertyValue('--seccion-min-height')).toBe('150px');
    });

    it('debe calcular min-height por defecto según el tipo de sección (Líneas 50-62)', () => {
        const casosTest = [
            { tipo: 'CABECERA', contenido: {}, esperado: '600px' },
            { tipo: 'BARRA_MENU', contenido: {}, esperado: '60px' },
            { tipo: 'LOGO', contenido: {}, esperado: '80px' },
            { tipo: 'PRODUCTOS', contenido: {}, esperado: '360px' },
            { tipo: 'CONTACTO', contenido: {}, esperado: '300px' },
            { tipo: 'REDES_SOCIALES', contenido: {}, esperado: '180px' },
            { tipo: 'OTRO_TIPO', contenido: {}, esperado: '200px' },
            { tipo: 'ACERCA_DE_NOSOTROS', contenido: { tarjetas: [1, 2] }, esperado: '320px' },
            { tipo: 'ACERCA_DE_NOSOTROS', contenido: {}, esperado: '280px' },
            { tipo: 'SERVICIOS', contenido: { servicios: [1, 2, 3] }, esperado: '360px' },
            { tipo: 'SERVICIOS', contenido: {}, esperado: '360px' }
        ];

        casosTest.forEach(({ tipo, contenido, esperado }) => {
            vi.clearAllMocks();
            resolverRenderizadoSeccion.mockReturnValue({
                Componente: MockComponente,
                props: { contenido }
            });

            const { container, unmount } = render(<RenderizadorSeccion tipoSeccion={tipo} contenidoJson={contenido} />);
            expect(container.firstElementChild.style.getPropertyValue('--seccion-min-height')).toBe(esperado);
            unmount(); 
        });
    });
});