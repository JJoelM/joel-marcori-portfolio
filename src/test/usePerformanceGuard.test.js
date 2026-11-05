import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePerformanceGuard } from '../hooks/usePerformanceGuard';

describe('usePerformanceGuard Hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('activa el fallback a modo FLAT cuando WebGL no está disponible', () => {
    // En entorno jsdom sin mock de WebGL, getContext retorna null
    const { result } = renderHook(() =>
      usePerformanceGuard({ initialMode: '3D', enableWatchdog: false })
    );

    // Debe conmutar automáticamente a FLAT por falta de WebGL
    expect(result.current.mode).toBe('FLAT');
    expect(result.current.webglSupported).toBe(false);
    expect(result.current.fallbackTriggered).toBe(true);
    expect(result.current.tier).toBe('FALLBACK');
  });

  it('mantiene modo 3D y permite alternar cuando WebGL está soportado', () => {
    // Simulamos soporte WebGL
    const mockGlContext = {
      getExtension: vi.fn(),
      getParameter: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockGlContext);

    const { result } = renderHook(() =>
      usePerformanceGuard({ initialMode: '3D', enableWatchdog: false })
    );

    expect(result.current.mode).toBe('3D');
    expect(result.current.webglSupported).toBe(true);
    expect(result.current.fallbackTriggered).toBe(false);

    // Alternar a FLAT
    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.mode).toBe('FLAT');

    // Alternar de regreso a 3D
    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.mode).toBe('3D');
  });

  it('permite descartar el aviso de fallback de rendimiento', () => {
    const { result } = renderHook(() =>
      usePerformanceGuard({ initialMode: '3D', enableWatchdog: false })
    );

    expect(result.current.fallbackTriggered).toBe(true);

    act(() => {
      result.current.dismissFallbackNotice();
    });

    expect(result.current.fallbackTriggered).toBe(false);
  });
});
