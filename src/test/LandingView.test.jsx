import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LandingView } from '../components/landing/LandingView';
import { ThemeProvider } from '../context/ThemeContext';
import i18n from '../i18n';

describe('LandingView Component (Concise Hero & Subtle Easter Egg)', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
    try {
      localStorage.clear();
    } catch {
      // Ignorar en entornos de test
    }
  });

  it('renderiza la identidad profesional y los dos selectores directos de entrada', () => {
    render(
      <ThemeProvider>
        <LandingView
          onStart3D={vi.fn()}
          onStartPlano={vi.fn()}
          tier="HIGH"
          webglSupported={true}
        />
      </ThemeProvider>
    );

    // Título y Nombre
    expect(screen.getByText(/PORTAL DE ACCESO/i)).toBeInTheDocument();
    expect(screen.getByText('Joel Jesús Marcori')).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer · Applied AI · Creative Technology/i)).toBeInTheDocument();

    // Opción 1: Oficina 3D
    expect(screen.getByRole('heading', { name: /OFICINA 3D/i })).toBeInTheDocument();
    expect(screen.getByText(/MODO 01 \/\/ 3D CANVAS/i)).toBeInTheDocument();

    // Opción 2: Modo Plano
    expect(screen.getByRole('heading', { name: /MODO PLANO/i })).toBeInTheDocument();
    expect(screen.getByText(/MODO 02 \/\/ TACTICAL HUD/i)).toBeInTheDocument();
  });

  it('inicia por defecto en estilo Cyber Fósforo y contiene la sutil referencia en el pie de página', () => {
    render(
      <ThemeProvider>
        <LandingView
          onStart3D={vi.fn()}
          onStartPlano={vi.fn()}
          tier="HIGH"
          webglSupported={true}
        />
      </ThemeProvider>
    );

    // Por defecto inicia en estilo Cyber Fósforo
    expect(
      screen.getByText(/PORTFOLIO \/\/ TERMINAL V2.4/i)
    ).toBeInTheDocument();

    // La pista sutil en el pie de página (sin emojis, discreta revisión de build)
    expect(screen.getByText(/SYS\.REV \/\/ 1947/i)).toBeInTheDocument();
  });

  it('desbloquea el Easter Egg Detective Noir desde el pie de página y permite conmutar', () => {
    render(
      <ThemeProvider>
        <LandingView
          onStart3D={vi.fn()}
          onStartPlano={vi.fn()}
          tier="HIGH"
          webglSupported={true}
        />
      </ThemeProvider>
    );

    // Clic en la revisión técnica sutil del footer para activar el Easter Egg
    const pistaBtn = screen.getByText(/SYS\.REV \/\/ 1947/i);
    fireEvent.click(pistaBtn);

    // Ahora el tema activo es Noir
    expect(
      screen.getByText(/EXPEDIENTE \/\/ BUREAU 1947/i)
    ).toBeInTheDocument();

    // El botón de conmutación de tema ahora está visible en el header
    const toggleBtn = screen.getByRole('button', { name: /TEMA: CYBER/i });
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);

    // Vuelve a Cyber
    expect(
      screen.getByText(/PORTFOLIO \/\/ TERMINAL V2.4/i)
    ).toBeInTheDocument();
  });

  it('dispara los callbacks correspondientes al seleccionar cada modo', () => {
    const handle3D = vi.fn();
    const handlePlano = vi.fn();

    render(
      <ThemeProvider>
        <LandingView
          onStart3D={handle3D}
          onStartPlano={handlePlano}
          tier="HIGH"
          webglSupported={true}
        />
      </ThemeProvider>
    );

    const btn3D = screen.getByRole('button', { name: /ENTRAR A LA OFICINA 3D/i });
    fireEvent.click(btn3D);
    expect(handle3D).toHaveBeenCalledTimes(1);

    const btnPlano = screen.getByRole('button', { name: /ENTRAR AL MODO PLANO/i });
    fireEvent.click(btnPlano);
    expect(handlePlano).toHaveBeenCalledTimes(1);
  });

  it('traduce dinámicamente todo el contenido al cambiar a inglés sin nada hardcodeado', () => {
    i18n.changeLanguage('en');
    render(
      <ThemeProvider>
        <LandingView
          onStart3D={vi.fn()}
          onStartPlano={vi.fn()}
          tier="HIGH"
          webglSupported={true}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/ACCESS PORTAL/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /3D OFFICE/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /PLAIN MODE/i })).toBeInTheDocument();
    expect(screen.getByText(/ENTER 3D OFFICE/i)).toBeInTheDocument();
    expect(screen.getByText(/ENTER PLAIN MODE/i)).toBeInTheDocument();
    expect(screen.getByText(/SYS\.REV \/\/ 1947/i)).toBeInTheDocument();
  });
});
