import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNavigate } from 'react-router-dom';
import { useEditorWeb } from '../js/pages/EditorWeb.js';
import { logout, getSlug } from '../services/authService'; // <-- Agregado getSlug
import EditorWeb from '../pages/EditorWeb.jsx'; 

// Mocks de dependencias externas
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../js/pages/EditorWeb.js', () => ({
    useEditorWeb: vi.fn(),
}));

vi.mock('../services/authService', () => ({
    logout: vi.fn(),
    getSlug: vi.fn(), // <-- Solución al error Uncaught Exception
}));

// Mock del subcomponente
vi.mock('../components/RenderizadorSeccion', () => ({
    RenderizadorSeccion: () => <div data-testid="renderizador-seccion">Mock Seccion</div>
}));

describe('EditorWeb Component - Test de Cobertura Completa', () => {
    const mockNavigate = vi.fn();
    
    const mockHookBase = {
        negocioId: '123',
        seccionSeleccionada: null,
        datosEdicion: {
            titulo: 'Mi Pyme',
            descripcion: 'Desc',
            textoLogo: 'Logo',
            enlaces: [],
            logoTipo: '',
            logotipo: '',
            tarjetas: [],
            nombre: '',
            foto: '',
            servicios: [],
            productos: [],
            colores: {}
        },
        // Solución al TypeError de alineacionTitulo:
        estilosTextoEdicion: {
            alineacionTitulo: 'center',
            // Agrega más estilos por defecto si tu componente los requiere
        },
        manejarCambioEstilosTexto: vi.fn(), 
        tarjetasEdicion: [],
        serviciosEdicion: [],
        productosEdicion: [],
        enlacesEdicion: [],
        coloresEdicion: { fondo: '#ffffff', textoTitulo: '#000000', textoSecundario: '#555555' },
        botonesSuperiores: ['LOGO', 'INICIO', 'SERVICIOS'],
        dragItem: { current: null },
        dragOverItem: { current: null },
        seleccionarSeccion: vi.fn(),
        manejarCambio: vi.fn(),
        manejarCambioColor: vi.fn(),
        manejarCambioTarjeta: vi.fn(),
        agregarTarjeta: vi.fn(),
        eliminarTarjeta: vi.fn(),
        manejarCambioServicio: vi.fn(),
        agregarServicio: vi.fn(),
        eliminarServicio: vi.fn(),
        manejarCambioProducto: vi.fn(),
        agregarProducto: vi.fn(),
        eliminarProducto: vi.fn(),
        manejarCambioEnlace: vi.fn(),
        agregarEnlace: vi.fn(),
        eliminarEnlace: vi.fn(),
        guardarCambios: vi.fn(),
        manejarSoltar: vi.fn(),
        manejarClickBoton: vi.fn(),
        seccionesOrdenadas: [
            { idSeccion: '1', tipoSeccion: 'BARRA_MENU', contenidoJson: {} },
            { idSeccion: '2', tipoSeccion: 'PRODUCTOS', contenidoJson: {} }
        ],
        logoSeccion: { idSeccion: '3', contenidoJson: {} },
        barraMenuSeccion: { contenidoJson: {} },
        combinarLogoEnMenu: false
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
    });

    it('debe renderizar el mensaje de selección vacía si no hay sección seleccionada', () => {
        useEditorWeb.mockReturnValue(mockHookBase);
        render(<EditorWeb />);
        expect(screen.getByText('Selecciona una sección para editar.')).toBeDefined();
    });

    it('debe navegar a la página pública al hacer clic en VER PAGINA', () => {
        useEditorWeb.mockReturnValue(mockHookBase);
        getSlug.mockReturnValue('mi-pyme-slug'); // Simulamos el slug devuelto por el servicio
        
        render(<EditorWeb />);
        
        const btnVerPagina = screen.getByRole('button', { name: /VER PAGINA/i });
        fireEvent.click(btnVerPagina);
        
        // Corregido según lo que pide tu componente real en la línea 56:
        expect(mockNavigate).toHaveBeenCalledWith('/PymeWeb/mi-pyme-slug');
    });

    it('no debe navegar si negocioId o slug no existen', () => {
        useEditorWeb.mockReturnValue({ ...mockHookBase, negocioId: null });
        getSlug.mockReturnValue(null);
        
        render(<EditorWeb />);
        
        const btnVerPagina = screen.getByRole('button', { name: /VER PAGINA/i });
        fireEvent.click(btnVerPagina);
        
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('debe cerrar sesión correctamente', () => {
        useEditorWeb.mockReturnValue(mockHookBase);
        render(<EditorWeb />);
        
        const btnLogout = screen.getByRole('button', { name: /CERRAR SESION/i });
        fireEvent.click(btnLogout);
        
        expect(logout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('debe activar eventos de Drag and Drop en los botones superiores', () => {
        useEditorWeb.mockReturnValue(mockHookBase);
        render(<EditorWeb />);
        
        const botonArrastrable = screen.getByRole('button', { name: 'INICIO' });
        
        fireEvent.dragStart(botonArrastrable);
        fireEvent.dragEnter(botonArrastrable);
        fireEvent.dragOver(botonArrastrable);
        fireEvent.dragEnd(botonArrastrable);

        expect(mockHookBase.dragItem.current).toBe(1); 
        expect(mockHookBase.dragOverItem.current).toBe(1);
        expect(mockHookBase.manejarSoltar).toHaveBeenCalled();
    });

    it('debe disparar manejarClickBoton al presionar un botón superior', () => {
        useEditorWeb.mockReturnValue(mockHookBase);
        render(<EditorWeb />);
        
        const botonLogo = screen.getByRole('button', { name: 'LOGO' });
        fireEvent.click(botonLogo);
        
        expect(mockHookBase.manejarClickBoton).toHaveBeenCalledWith('LOGO');
    });

    it('debe seleccionar una sección al hacer clic en el canvas', () => {
        useEditorWeb.mockReturnValue(mockHookBase);
        const { container } = render(<EditorWeb />);
        
        const seccionPreview = container.querySelector('.seccion-preview');
        fireEvent.click(seccionPreview);
        
        expect(mockHookBase.seleccionarSeccion).toHaveBeenCalledWith(mockHookBase.seccionesOrdenadas[0]);
    });

    it('debe mostrar inputs generales y manejar cambios de color y texto', () => {
        const mockSeccion = { idSeccion: '2', tipoSeccion: 'HERO' };
        useEditorWeb.mockReturnValue({
            ...mockHookBase,
            seccionSeleccionada: mockSeccion
        });

        const { container } = render(<EditorWeb />);

        const inputTitulo = screen.getByDisplayValue('Mi Pyme');
        fireEvent.change(inputTitulo, { target: { value: 'Nuevo' } });
        expect(mockHookBase.manejarCambio).toHaveBeenCalled();

        const inputColor = container.querySelector('input[type="color"]');
        fireEvent.change(inputColor, { target: { value: '#000000' } });
        expect(mockHookBase.manejarCambioColor).toHaveBeenCalledWith('fondo', '#000000');

        const inputsColor = container.querySelectorAll('input[type="color"]');

        fireEvent.change(inputsColor[0], { target: { value: '#111111' } });
        expect(mockHookBase.manejarCambioColor).toHaveBeenCalledWith('fondo', '#111111');

        fireEvent.change(inputsColor[1], { target: { value: '#222222' } });
        expect(mockHookBase.manejarCambioColor).toHaveBeenCalledWith('textoTitulo', '#222222');

        fireEvent.change(inputsColor[2], { target: { value: '#333333' } });
        expect(mockHookBase.manejarCambioColor).toHaveBeenCalledWith('textoSecundario', '#333333');
    });

    it('debe renderizar y gestionar el flujo de la BARRA_MENU (Enlaces)', () => {
        const mockSeccion = { idSeccion: '1', tipoSeccion: 'BARRA_MENU' };
        useEditorWeb.mockReturnValue({
            ...mockHookBase,
            seccionSeleccionada: mockSeccion,
            enlacesEdicion: [{ texto: 'Contacto' }]
        });

        render(<EditorWeb />);

        const inputEnlace = screen.getByDisplayValue('Contacto');
        fireEvent.change(inputEnlace, { target: { value: 'Contacto Modificado' } });
        expect(mockHookBase.manejarCambioEnlace).toHaveBeenCalledWith(0, 'Contacto Modificado');

        fireEvent.click(screen.getByRole('button', { name: /ELIMINAR ENLACE/i }));
        expect(mockHookBase.eliminarEnlace).toHaveBeenCalledWith(0);

        fireEvent.click(screen.getByRole('button', { name: /AGREGAR ENLACE/i }));
        expect(mockHookBase.agregarEnlace).toHaveBeenCalled();
    });

    it('debe renderizar y gestionar el flujo de ACERCA_DE_NOSOTROS (Tarjetas)', () => {
        const mockSeccion = { idSeccion: '4', tipoSeccion: 'ACERCA_DE_NOSOTROS' };
        useEditorWeb.mockReturnValue({
            ...mockHookBase,
            seccionSeleccionada: mockSeccion,
            tarjetasEdicion: [{ nombre: 'Juan', descripcion: 'CEO', foto: '' }]
        });

        render(<EditorWeb />);

        const inputNombre = screen.getByDisplayValue('Juan');
        fireEvent.change(inputNombre, { target: { value: 'Pedro' } });
        expect(mockHookBase.manejarCambioTarjeta).toHaveBeenCalledWith(0, 'nombre', 'Pedro');

        fireEvent.click(screen.getByRole('button', { name: /ELIMINAR TARJETA/i }));
        expect(mockHookBase.eliminarTarjeta).toHaveBeenCalledWith(0);

        fireEvent.click(screen.getByRole('button', { name: /AGREGAR TARJETA/i }));
        expect(mockHookBase.agregarTarjeta).toHaveBeenCalled();

        const inputDescripcion = screen.getByDisplayValue('CEO');
        fireEvent.change(inputDescripcion, { target: { value: 'Gerente' } });
        expect(mockHookBase.manejarCambioTarjeta).toHaveBeenCalledWith(0, 'descripcion', 'Gerente');

        const inputFoto = screen.getByPlaceholderText('https://...');
        fireEvent.change(inputFoto, { target: { value: 'https://foto.jpg' } });
        expect(mockHookBase.manejarCambioTarjeta).toHaveBeenCalledWith(0, 'foto', 'https://foto.jpg');
    });

    it('debe renderizar y gestionar el flujo de SERVICIOS', () => {
        const mockSeccion = { idSeccion: '5', tipoSeccion: 'SERVICIOS' };
        useEditorWeb.mockReturnValue({
            ...mockHookBase,
            seccionSeleccionada: mockSeccion,
            serviciosEdicion: [{ titulo: 'Soporte', descripcion: '24/7', icono: '' }]
        });

        render(<EditorWeb />);

        const inputTitulo = screen.getByDisplayValue('Soporte');
        fireEvent.change(inputTitulo, { target: { value: 'Soporte Premium' } });
        expect(mockHookBase.manejarCambioServicio).toHaveBeenCalledWith(0, 'titulo', 'Soporte Premium');

        fireEvent.click(screen.getByRole('button', { name: /ELIMINAR SERVICIO/i }));
        expect(mockHookBase.eliminarServicio).toHaveBeenCalledWith(0);

        fireEvent.click(screen.getByRole('button', { name: /AGREGAR SERVICIO/i }));
        expect(mockHookBase.agregarServicio).toHaveBeenCalled();

        const inputDescripcion = screen.getByDisplayValue('24/7');
        fireEvent.change(inputDescripcion, { target: { value: 'Siempre disponible' } });
        expect(mockHookBase.manejarCambioServicio).toHaveBeenCalledWith(0, 'descripcion', 'Siempre disponible');

        const inputIcono = screen.getByPlaceholderText('https://...');
        fireEvent.change(inputIcono, { target: { value: 'https://icono.png' } });
        expect(mockHookBase.manejarCambioServicio).toHaveBeenCalledWith(0, 'icono', 'https://icono.png');
    });

    it('debe renderizar y gestionar el flujo de PRODUCTOS', () => {
        const mockSeccion = { idSeccion: '6', tipoSeccion: 'PRODUCTOS' };
        useEditorWeb.mockReturnValue({
            ...mockHookBase,
            seccionSeleccionada: mockSeccion,
            productosEdicion: [{ titulo: 'Item 1', descripcion: 'Desc', precio: '100', imagen: '' }]
        });

        render(<EditorWeb />);

        expect(screen.getByText(/Los productos se gestionan desde el inventario/i)).toBeDefined();

        fireEvent.click(screen.getByRole('button', { name: /IR AL INVENTARIO/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/inventario');
    });

    it('debe guardar cambios al presionar el botón GUARDAR CAMBIOS', () => {
        useEditorWeb.mockReturnValue({
            ...mockHookBase,
            seccionSeleccionada: { idSeccion: '2', tipoSeccion: 'HERO' }
        });
        render(<EditorWeb />);

        fireEvent.click(screen.getByRole('button', { name: /GUARDAR CAMBIOS/i }));
        expect(mockHookBase.guardarCambios).toHaveBeenCalled();
    });

    it('debe retornar null en la sección LOGO si combinarLogoEnMenu es verdadero', () => {
        useEditorWeb.mockReturnValue({
            ...mockHookBase,
            combinarLogoEnMenu: true,
            seccionesOrdenadas: [{ idSeccion: '3', tipoSeccion: 'LOGO', contenidoJson: {} }]
        });
        const { container } = render(<EditorWeb />);
        
        expect(container.querySelector('.seccion-preview')).toBeNull();
    });
});