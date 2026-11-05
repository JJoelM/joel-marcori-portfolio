import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PanelNavegacion } from '../components/ui/PanelNavegacion';
import { ThemeProvider } from '../context/ThemeContext';
import i18n from '../i18n';

describe('PanelNavegacion Component (Drawer & Mobile Responsiveness)', () => {
  const VISTAS = {
    INICIO: 'INICIO',
    CV: 'CV',
    PROYECTOS: 'PROYECTOS',
  };

  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  it('renderiza el botón flotante móvil y los expedientes', () => {
    render(
      <ThemeProvider>
        <PanelNavegacion
          vistaActual={VISTAS.INICIO}
          setVistaActual={vi.fn()}
          vistas={VISTAS}
          onOpenContact={vi.fn()}
        />
      </ThemeProvider>
    );

    // Botón flotante móvil
    const mobileBtn = screen.getByRole('button', { name: /Abrir panel de expedientes/i });
    expect(mobileBtn).toBeInTheDocument();

    // Expedientes disponibles
    expect(screen.getByText(/Sujeto: Joel/i)).toBeInTheDocument();
    expect(screen.getByText(/Caso: Experiencia y Proyectos/i)).toBeInTheDocument();
  });

  it('abre el drawer al pulsar el botón móvil y lo cierra al seleccionar un expediente', () => {
    const handleSetVista = vi.fn();

    render(
      <ThemeProvider>
        <PanelNavegacion
          vistaActual={VISTAS.INICIO}
          setVistaActual={handleSetVista}
          vistas={VISTAS}
          onOpenContact={vi.fn()}
        />
      </ThemeProvider>
    );

    const mobileBtn = screen.getByRole('button', { name: /Abrir panel de expedientes/i });
    expect(mobileBtn).toHaveAttribute('aria-expanded', 'false');

    // Clic en abrir drawer
    fireEvent.click(mobileBtn);
    expect(mobileBtn).toHaveAttribute('aria-expanded', 'true');

    // Clic en Expediente CV
    const cvBtn = screen.getByText(/Sujeto: Joel/i);
    fireEvent.click(cvBtn);

    expect(handleSetVista).toHaveBeenCalledWith(VISTAS.CV);
    expect(mobileBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('permite cerrar el drawer mediante el botón [✕] en móvil', () => {
    render(
      <ThemeProvider>
        <PanelNavegacion
          vistaActual={VISTAS.INICIO}
          setVistaActual={vi.fn()}
          vistas={VISTAS}
          onOpenContact={vi.fn()}
        />
      </ThemeProvider>
    );

    const mobileBtn = screen.getByRole('button', { name: /Abrir panel de expedientes/i });
    fireEvent.click(mobileBtn);
    expect(mobileBtn).toHaveAttribute('aria-expanded', 'true');

    // Botón cerrar [✕]
    const closeBtn = screen.getByRole('button', { name: /Cerrar panel de expedientes/i });
    fireEvent.click(closeBtn);
    expect(mobileBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('invoca el callback onOpenContact al pulsar la opción de contacto rápido', () => {
    const handleContact = vi.fn();

    render(
      <ThemeProvider>
        <PanelNavegacion
          vistaActual={VISTAS.INICIO}
          setVistaActual={vi.fn()}
          vistas={VISTAS}
          onOpenContact={handleContact}
        />
      </ThemeProvider>
    );

    const contactBtn = screen.getByText(/Contacto Rápido/i);
    fireEvent.click(contactBtn);

    expect(handleContact).toHaveBeenCalledTimes(1);
  });
});
