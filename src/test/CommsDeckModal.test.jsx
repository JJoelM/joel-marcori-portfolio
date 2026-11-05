import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CommsDeckModal } from '../components/ui/CommsDeckModal';
import i18n from '../i18n';

describe('CommsDeckModal (Terminal de Contacto Rápido)', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  it('no se renderiza si isOpen es falso', () => {
    const { container } = render(
      <CommsDeckModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('muestra la terminal de contacto con email, roles, links y disponibilidad cuando isOpen es verdadero', () => {
    render(<CommsDeckModal isOpen={true} onClose={vi.fn()} />);

    expect(
      screen.getByText(/TERMINAL DE CONTACTO RÁPIDO \/\/ COMMS DECK/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ESTADO: DISPONIBLE PARA CONTRATACIÓN/i)
    ).toBeInTheDocument();
    expect(screen.getByText('joelmarcori1@gmail.com')).toBeInTheDocument();
    expect(
      screen.getByText(/LINKEDIN \/\/ PERFIL PROFESIONAL/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/GITHUB \/\/ REPOSITORIOS & CÓDIGO/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/\[DESCARGAR CV OFICIAL EN PDF\]/i)
    ).toBeInTheDocument();
  });

  it('llama a onClose al presionar el botón de cerrar o la tecla Escape', () => {
    const handleClose = vi.fn();
    render(<CommsDeckModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByText(/\[ CERRAR ✕ \]/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('permite copiar el correo al portapapeles y ofrece retroalimentación visual', () => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(<CommsDeckModal isOpen={true} onClose={vi.fn()} />);

    const copyBtn = screen.getByText(/\[COPIAR EMAIL\]/i);
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'joelmarcori1@gmail.com'
    );
    expect(
      screen.getByText(/¡Email copiado al portapapeles!/i)
    ).toBeInTheDocument();
  });
});
