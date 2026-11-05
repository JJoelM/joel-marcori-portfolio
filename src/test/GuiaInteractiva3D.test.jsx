import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { GuiaInteractiva3D } from '../components/3d/GuiaInteractiva3D';
import i18n from '../i18n';

describe('GuiaInteractiva3D (Tutorial & Objetivos de Investigación)', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  it('aparece minimizada por defecto mostrando la pill discreta de investigación', () => {
    render(
      <GuiaInteractiva3D
        visionDetective={true}
        setVisionDetective={vi.fn()}
        itemsInspeccionados={new Set()}
        onSeleccionarObjetivo={vi.fn()}
      />
    );

    expect(screen.getByText(/\[ \? GUÍA DE INVESTIGACIÓN \]/i)).toBeInTheDocument();
    expect(screen.getByText('0/5')).toBeInTheDocument();
  });

  it('renderiza la lista completa de objetivos al estar expandida', () => {
    render(
      <GuiaInteractiva3D
        visionDetective={true}
        setVisionDetective={vi.fn()}
        itemsInspeccionados={new Set()}
        onSeleccionarObjetivo={vi.fn()}
        defaultMinimizado={false}
      />
    );

    expect(screen.getByText(/OBJETIVOS DE INVESTIGACIÓN/i)).toBeInTheDocument();
    expect(screen.getByText(/EXPEDIENTE #01: LA OFICINA DEL INVESTIGADOR/i)).toBeInTheDocument();
    expect(screen.getByText('Monitor CRT')).toBeInTheDocument();
    expect(screen.getByText('Expediente Central')).toBeInTheDocument();
    expect(screen.getByText('Expediente Lateral')).toBeInTheDocument();
    expect(screen.getByText('Lámpara de Mesa')).toBeInTheDocument();
    expect(screen.getByText('Radio Vintage')).toBeInTheDocument();
  });

  it('permite alternar el estado de Visión Detective (Outlines tácticos)', () => {
    const handleToggle = vi.fn();
    render(
      <GuiaInteractiva3D
        visionDetective={true}
        setVisionDetective={handleToggle}
        itemsInspeccionados={new Set()}
        onSeleccionarObjetivo={vi.fn()}
        defaultMinimizado={false}
      />
    );

    const toggleBtn = screen.getByText(/\[ SCANNER: ON \]/i);
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it('marca las evidencias con [✓] y muestra el mensaje de completado cuando todas son examinadas', () => {
    const todosExaminados = new Set(['MONITOR', 'CV', 'PROYECTOS', 'LAMPARA', 'PARLANTE']);
    render(
      <GuiaInteractiva3D
        visionDetective={true}
        setVisionDetective={vi.fn()}
        itemsInspeccionados={todosExaminados}
        onSeleccionarObjetivo={vi.fn()}
        defaultMinimizado={false}
      />
    );

    expect(screen.getByText('5/5')).toBeInTheDocument();
    expect(screen.getByText(/¡TODAS LAS EVIDENCIAS EXAMINADAS!/i)).toBeInTheDocument();
  });

  it('permite expandir desde el estado minimizado inicial y luego volver a minimizar', async () => {
    render(
      <GuiaInteractiva3D
        visionDetective={true}
        setVisionDetective={vi.fn()}
        itemsInspeccionados={new Set()}
        onSeleccionarObjetivo={vi.fn()}
      />
    );

    // Inicialmente minimizada
    const expandBtn = screen.getByText(/\[ \? GUÍA DE INVESTIGACIÓN \]/i);
    expect(expandBtn).toBeInTheDocument();

    // Clic para expandir
    fireEvent.click(expandBtn);

    await waitFor(() => {
      expect(screen.getByText(/EXPEDIENTE #01: LA OFICINA DEL INVESTIGADOR/i)).toBeInTheDocument();
    });

    // Botón minimizar
    const minBtn = screen.getByTitle(/Minimizar panel de guía/i);
    fireEvent.click(minBtn);

    // Vuelve a estar minimizada
    await waitFor(() => {
      expect(screen.getByText(/\[ \? GUÍA DE INVESTIGACIÓN \]/i)).toBeInTheDocument();
    });
  });

  it('traduce dinámicamente todos los objetivos al inglés', () => {
    i18n.changeLanguage('en');
    render(
      <GuiaInteractiva3D
        visionDetective={true}
        setVisionDetective={vi.fn()}
        itemsInspeccionados={new Set()}
        onSeleccionarObjetivo={vi.fn()}
        defaultMinimizado={false}
      />
    );

    expect(screen.getByText(/INVESTIGATION OBJECTIVES/i)).toBeInTheDocument();
    expect(screen.getByText('CRT Monitor')).toBeInTheDocument();
    expect(screen.getByText('Central Dossier')).toBeInTheDocument();
    expect(screen.getByText('Side Dossier')).toBeInTheDocument();
    expect(screen.getByText('Desk Lamp')).toBeInTheDocument();
    expect(screen.getByText('Vintage Radio')).toBeInTheDocument();
    expect(screen.getByText(/\[ SCANNER: ON \]/i)).toBeInTheDocument();
  });
});
