import { describe, it, expect } from 'vitest';
import {
  PROJECTS_DATA,
  CATEGORIES,
  getProjectsByCategory,
  getProjectById,
} from '../data/projectsData';

describe('PROJECTS_DATA Schema & Helpers', () => {
  it('contiene proyectos con la estructura B2B requerida', () => {
    expect(PROJECTS_DATA.length).toBeGreaterThan(0);

    PROJECTS_DATA.forEach((project) => {
      // Identificadores y metadatos básicos
      expect(project.id).toBeDefined();
      expect(typeof project.title).toBe('string');
      expect(typeof project.tagline).toBe('string');
      expect(typeof project.role).toBe('string');
      expect(typeof project.clientOrContext).toBe('string');

      // 1. Problema de Negocio
      expect(project.businessProblem).toBeDefined();
      expect(typeof project.businessProblem.summary).toBe('string');
      expect(Array.isArray(project.businessProblem.painPoints)).toBe(true);
      expect(project.businessProblem.painPoints.length).toBeGreaterThan(0);
      expect(typeof project.businessProblem.targetGoal).toBe('string');

      // 2. Arquitectura Técnica
      expect(project.technicalArchitecture).toBeDefined();
      expect(typeof project.technicalArchitecture.pattern).toBe('string');
      expect(typeof project.technicalArchitecture.backend).toBe('string');
      expect(Array.isArray(project.technicalArchitecture.stack)).toBe(true);
      expect(project.technicalArchitecture.stack.length).toBeGreaterThan(0);
      expect(Array.isArray(project.technicalArchitecture.highlights)).toBe(true);

      // 3. Solución Implementada e IA
      expect(project.implementedSolution).toBeDefined();
      expect(typeof project.implementedSolution.mvp).toBe('string');
      expect(typeof project.implementedSolution.aiIntegration).toBe('string');
      expect(Array.isArray(project.implementedSolution.keyFeatures)).toBe(true);

      // 4. Impacto y Métricas
      expect(project.businessImpact).toBeDefined();
      expect(Array.isArray(project.businessImpact.metrics)).toBe(true);
      expect(project.businessImpact.metrics.length).toBeGreaterThan(0);
      expect(typeof project.businessImpact.roiSummary).toBe('string');
    });
  });

  it('permite filtrar proyectos por categoría', () => {
    const aiProjects = getProjectsByCategory('ai');
    expect(aiProjects.length).toBeGreaterThan(0);
    expect(aiProjects.every((p) => p.category === 'ai')).toBe(true);

    const b2bProjects = getProjectsByCategory('b2b');
    expect(b2bProjects.length).toBeGreaterThan(0);
    expect(b2bProjects.every((p) => p.category === 'b2b')).toBe(true);

    const allProjects = getProjectsByCategory('all');
    expect(allProjects.length).toBe(PROJECTS_DATA.length);
  });

  it('permite buscar un proyecto por su ID único', () => {
    const pfc = getProjectById('pfc_gamificacion');
    expect(pfc).not.toBeNull();
    expect(pfc?.id).toBe('pfc_gamificacion');
    expect(pfc?.technicalArchitecture.pattern).toContain('CQRS');

    const nonExistent = getProjectById('inexistente_123');
    expect(nonExistent).toBeNull();
  });

  it('define categorías con id, label e icono', () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(4);
    CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.label).toBeDefined();
      expect(cat.icon).toBeDefined();
    });
  });
});
