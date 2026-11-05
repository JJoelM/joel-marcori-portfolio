import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ExpedienteCV } from '../components/ui/ExpedienteCV';
import { ExpedienteProyectos } from '../components/ui/ExpedientesProyectos';
import i18n from '../i18n';

describe('3D Mode Dossiers Responsive & Interactive Behavior', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  describe('ExpedienteCV Component', () => {
    it('renderiza la cabecera confidencial, la primera hoja y permite paginar', async () => {
      render(<ExpedienteCV isVisible={true} cerrarModal={vi.fn()} />);

      // Cabecera confidencial
      expect(screen.getByText(/INVESTIGACIÓN: JOEL MARCORI/i)).toBeInTheDocument();
      expect(screen.getByText(/CONFIDENCIAL \/\/ NIVEL_4/i)).toBeInTheDocument();

      // Botón de descarga de PDF
      expect(screen.getByText(/Adjunto: PDF_CV_Oficial/i)).toBeInTheDocument();

      // Botón Siguiente
      const btnSiguiente = screen.getByRole('button', { name: /Pág\. Siguiente/i });
      expect(btnSiguiente).toBeInTheDocument();

      fireEvent.click(btnSiguiente);

      await waitFor(() => {
        // Hoja 2 (Experiencia)
        expect(screen.getByText(/Historial Operativo/i)).toBeInTheDocument();
      });
    });

    it('invoca cerrarModal al pulsar el botón [✕]', () => {
      const handleClose = vi.fn();
      render(<ExpedienteCV isVisible={true} cerrarModal={handleClose} />);

      const closeBtn = screen.getByRole('button', { name: /Cerrar Expediente/i });
      fireEvent.click(closeBtn);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('ExpedienteProyectos Component', () => {
    it('renderiza los proyectos con sus pestañas marcapáginas y permite alternar categorías', async () => {
      render(<ExpedienteProyectos isVisible={true} cerrarModal={vi.fn()} />);

      // Pestañas de categorías
      const tab1 = screen.getAllByText(/Backend & Arquitectura/i)[0];
      const tab2 = screen.getByText(/Technical Art y Modelado 3D/i);

      expect(tab1).toBeInTheDocument();
      expect(tab2).toBeInTheDocument();

      // Cambio de pestaña
      fireEvent.click(tab2);

      await waitFor(() => {
        expect(screen.getByText(/Producción de Assets Estilizados y PBR/i)).toBeInTheDocument();
      });
    });

    it('invoca cerrarModal al pulsar el botón [✕]', () => {
      const handleClose = vi.fn();
      render(<ExpedienteProyectos isVisible={true} cerrarModal={handleClose} />);

      const closeBtn = screen.getByRole('button', { name: /Cerrar Expediente/i });
      fireEvent.click(closeBtn);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
