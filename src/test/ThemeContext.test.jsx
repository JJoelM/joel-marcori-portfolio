import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function TestConsumer() {
  const {
    tema,
    esNoir,
    easterEggDesbloqueado,
    desbloquearEasterEgg,
    toggleTema,
  } = useTheme();

  return (
    <div>
      <span data-testid="tema">{tema}</span>
      <span data-testid="esNoir">{esNoir ? 'SI' : 'NO'}</span>
      <span data-testid="desbloqueado">{easterEggDesbloqueado ? 'SI' : 'NO'}</span>
      <button onClick={desbloquearEasterEgg}>Desbloquear</button>
      <button onClick={toggleTema}>Toggle</button>
    </div>
  );
}

describe('ThemeContext & Easter Egg Global', () => {
  beforeEach(() => {
    try {
      localStorage.clear();
    } catch {
      // Ignorar
    }
  });

  it('inicia por defecto con tema CYBER y easter egg bloqueado', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('tema').textContent).toBe('CYBER');
    expect(screen.getByTestId('esNoir').textContent).toBe('NO');
    expect(screen.getByTestId('desbloqueado').textContent).toBe('NO');
  });

  it('desbloquea el easter egg al invocar desbloquearEasterEgg y activa NOIR', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Desbloquear'));

    expect(screen.getByTestId('tema').textContent).toBe('NOIR');
    expect(screen.getByTestId('esNoir').textContent).toBe('SI');
    expect(screen.getByTestId('desbloqueado').textContent).toBe('SI');
  });

  it('permite alternar entre CYBER y NOIR una vez desbloqueado', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Desbloquear'));
    expect(screen.getByTestId('tema').textContent).toBe('NOIR');

    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('tema').textContent).toBe('CYBER');

    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('tema').textContent).toBe('NOIR');
  });

  it('detecta la secuencia de teclado secreta "noir" y desbloquea el easter egg', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('desbloqueado').textContent).toBe('NO');

    act(() => {
      fireEvent.keyDown(window, { key: 'n' });
      fireEvent.keyDown(window, { key: 'o' });
      fireEvent.keyDown(window, { key: 'i' });
      fireEvent.keyDown(window, { key: 'r' });
    });

    expect(screen.getByTestId('tema').textContent).toBe('NOIR');
    expect(screen.getByTestId('desbloqueado').textContent).toBe('SI');
  });
});
