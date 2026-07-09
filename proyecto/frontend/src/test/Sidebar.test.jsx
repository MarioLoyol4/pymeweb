import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from '../components/Sidebar.jsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Sidebar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('navega al editor al hacer clic en Volver a editar', () => {
    render(<Sidebar />);

    fireEvent.click(screen.getByRole('button', { name: /Volver a editar/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/editor');
  });
});