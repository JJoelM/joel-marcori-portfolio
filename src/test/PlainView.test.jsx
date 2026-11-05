import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { VistaPlana } from '../components/flat/PlainView';
import i18n from '../i18n';

describe('VistaPlana (Modo Plano Táctico)', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  it('renderiza la ventana Windows XP / Persona 5 con identidad profesional en español', () => {
    render(<VistaPlana onSwitchTo3D={vi.fn()} />);

    // Barra de título Windows XP
    expect(
      screen.getByText(/C:\\SYS\\PORTFOLIO\.EXE/i)
    ).toBeInTheDocument();

    // Persona 5 Identity Sticker
    expect(
      screen.getByText(/SOFTWARE ENGINEER \/\/ FULL-STACK \/\/ APPLIED AI \/\/ TECHNICAL ARTIST/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/JOEL JESÚS MARCORI/i)).toBeInTheDocument();
  });

  it('muestra el contador de proyectos y el contador de antigüedad técnica', () => {
    render(<VistaPlana onSwitchTo3D={vi.fn()} />);

    // Contador de proyectos
    expect(screen.getByText('TOTAL PROYECTOS')).toBeInTheDocument();
    expect(screen.getByText('REGISTROS AUDITADOS')).toBeInTheDocument();

    // Contador de antigüedad técnica
    expect(screen.getByText('ANTIGÜEDAD TÉCNICA')).toBeInTheDocument();
    expect(screen.getByText('TRAYECTORIA (DESDE 2019)')).toBeInTheDocument();
  });

  it('permite alternar entre los módulos temáticos (Proyectos, Art 3D, Historial, Stack)', async () => {
    render(<VistaPlana onSwitchTo3D={vi.fn()} />);

    // Módulo Technical Art & 3D (Lado Artístico)
    const artTab = screen.getByRole('button', {
      name: /\[02\] TECHNICAL ART & 3D/i,
    });
    fireEvent.click(artTab);

    await waitFor(() => {
      expect(
        screen.getByText(/TECHNICAL ART, TOPOLOGÍA & SHADERS EN TIEMPO REAL/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/PIPELINE 3D DE ALTO RENDIMIENTO/i)
      ).toBeInTheDocument();
    });

    // Módulo Matriz de Competencias
    const stackTab = screen.getByRole('button', {
      name: /\[04\] MATRIZ DE COMPETENCIAS/i,
    });
    fireEvent.click(stackTab);

    await waitFor(() => {
      expect(
        screen.getByText(/\[01\] BACKEND & ARQUITECTURA/i)
      ).toBeInTheDocument();
    });
  });

  it('ejecuta la llamada para iniciar el entorno 3D al presionar el botón de ejecución', () => {
    const handleSwitch = vi.fn();
    render(<VistaPlana onSwitchTo3D={handleSwitch} />);

    const launchButtons = screen.getAllByText(/EJECUTAR ENTORNO 3D/i);
    expect(launchButtons.length).toBeGreaterThan(0);
    fireEvent.click(launchButtons[0]);

    expect(handleSwitch).toHaveBeenCalledTimes(1);
  });

  it('traduce dinámicamente todos los textos al cambiar el idioma a inglés sin nada hardcodeado', () => {
    i18n.changeLanguage('en');
    render(<VistaPlana onSwitchTo3D={vi.fn()} />);

    expect(screen.getByText('TOTAL PROJECTS')).toBeInTheDocument();
    expect(screen.getByText('AUDITED RECORDS')).toBeInTheDocument();
    expect(screen.getByText('TECHNICAL SENIORITY')).toBeInTheDocument();
    expect(screen.getByText('TRAJECTORY (SINCE 2019)')).toBeInTheDocument();
    expect(screen.getByText('[01] B2B CASE STUDIES')).toBeInTheDocument();
    expect(screen.getByText('[DOWNLOAD CV / PDF]')).toBeInTheDocument();
  });

  it('renderiza la trayectoria con Scrollytelling interactivo y 4 capítulos al activar su pestaña o botón de Hero', async () => {
    const handleContact = vi.fn();
    render(<VistaPlana onSwitchTo3D={vi.fn()} onOpenContact={handleContact} />);

    // Activación mediante botón directo en Hero
    const heroTrajectoryBtn = screen.getByText(/\[ VER RECORRIDO NARRATIVO → \]/i);
    expect(heroTrajectoryBtn).toBeInTheDocument();
    fireEvent.click(heroTrajectoryBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/TRAYECTORIA \/\/ LÍNEA DE TIEMPO DEL INGENIERO/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/SCROLLYTELLING \/\/ CAPÍTULOS DE INVESTIGACIÓN/i)
      ).toBeInTheDocument();
      // Capítulos clave
      expect(
        screen.getByText(/Raíces en Ingeniería & Robótica/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Algoritmos, Estructuras de Datos y Rigor Académico/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/El Factor Game Master/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Arquitectura B2B, Event Sourcing y Applied AI/i)
      ).toBeInTheDocument();
      // Citas Persona 5
      expect(
        screen.getByText(/La robustez de un sistema se decide antes de escribir la primera línea de código\./i)
      ).toBeInTheDocument();
      // Métrica clave
      expect(screen.getByText('+300 Alumnos')).toBeInTheDocument();
    });

    // Botón final de salto a Proyectos
    const goToProjectsBtn = screen.getByText(/\[ EXPLORAR CASOS DE ESTUDIO B2B → \]/i);
    expect(goToProjectsBtn).toBeInTheDocument();
    fireEvent.click(goToProjectsBtn);

    await waitFor(() => {
      expect(screen.getByText(/FILTRAR CASO:/i)).toBeInTheDocument();
    });

    // Botón de contacto rápido invoca onOpenContact
    const contactBtns = screen.getAllByText(/\[ CONTACTAR \]/i);
    expect(contactBtns.length).toBeGreaterThan(0);
    fireEvent.click(contactBtns[0]);
    expect(handleContact).toHaveBeenCalledTimes(1);
  });

  it('ejecuta setModoApp con "LANDING" al presionar el botón de minimizar [_] de la ventana', () => {
    const handleSetModoApp = vi.fn();
    render(<VistaPlana onSwitchTo3D={vi.fn()} setModoApp={handleSetModoApp} />);

    const minimizeBtn = screen.getByRole('button', { name: /minimizar/i });
    expect(minimizeBtn).toBeInTheDocument();
    fireEvent.click(minimizeBtn);

    expect(handleSetModoApp).toHaveBeenCalledWith('LANDING');
  });
});
