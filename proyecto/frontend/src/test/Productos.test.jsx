import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Productos } from '../components/secciones/Productos.jsx';

describe('Productos section', () => {
    it('muestra un CTA para ir al inventario en lugar de listar productos', () => {
        render(
            <MemoryRouter>
                <Productos contenido={{ titulo: 'Productos', descripcion: 'Gestiona tu catálogo' }} />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument();
        expect(screen.getByText('Gestiona tu catálogo')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Ir al inventario' })).toHaveAttribute('href', '/inventario');
    });
});