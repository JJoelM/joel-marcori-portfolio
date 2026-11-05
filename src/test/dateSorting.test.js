import { describe, it, expect } from 'vitest';
import { parseFechaReciente, ordenarProyectosRecientes } from '../utils/dateSorting';

describe('dateSorting utility', () => {
  it('asigna mayor puntaje a fechas más recientes y en curso', () => {
    const pfc = parseFechaReciente('Abril 2026 - Actualidad');
    const portafolio = parseFechaReciente('Marzo 2026 - Abril 2026');
    const ocio = parseFechaReciente('2025');
    const negi = parseFechaReciente('2024');

    expect(pfc).toBeGreaterThan(portafolio);
    expect(portafolio).toBeGreaterThan(ocio);
    expect(ocio).toBeGreaterThan(negi);
  });

  it('ordena correctamente un array de proyectos del más reciente al más antiguo', () => {
    const proyectos = [
      { id: 'negi', fecha: '2024' },
      { id: 'portafolio', fecha: 'Marzo 2026 - Abril 2026' },
      { id: 'ocio', fecha: '2025' },
      { id: 'pfc', fecha: 'Abril 2026 - Actualidad' },
    ];

    const ordenados = ordenarProyectosRecientes(proyectos);
    expect(ordenados.map((p) => p.id)).toEqual(['pfc', 'portafolio', 'ocio', 'negi']);
  });

  it('funciona en inglés con fechas equivalentes', () => {
    const pfcEn = parseFechaReciente('April 2026 - Present');
    const ocioEn = parseFechaReciente('2025');
    const negiEn = parseFechaReciente('2024');

    expect(pfcEn).toBeGreaterThan(ocioEn);
    expect(ocioEn).toBeGreaterThan(negiEn);
  });
});
