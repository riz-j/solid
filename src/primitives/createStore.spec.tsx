import { atom } from 'nanostores';
import { cleanup, render, screen } from 'solid-testing-library';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test } from 'vitest';

import { createStore } from '../index';

describe('createStore', () => {
  beforeEach(() => {
    cleanup();
  });

  test('object', async() => {
    const counter = atom({ value: 0 });

    const App = () => {
      const [state, setState] = createStore(counter);

      const inc = () => setState({ value: state().value + 1 });
      const dec = () => setState({ value: state().value - 1 });

      return (
        <>
          <div data-testid="count">{state().value}</div>
          <button data-testid="inc" onClick={inc}>+</button>
          <button data-testid="dec" onClick={dec}>-</button>
        </>
      );
    };

    render(() => <App />);

    const increment = await screen.findByTestId('inc');
    const decrement = await screen.findByTestId('dec');

    userEvent.click(increment);
    userEvent.click(increment);

    expect((await screen.findByTestId('count')).textContent).toBe('2');
    userEvent.click(decrement);
    expect((await screen.findByTestId('count')).textContent).toBe('1');
  });

  test('primtive', async() => {
    const counter = atom(0);

    const App = () => {
      const [count, setCount] = createStore(counter);

      const inc = () => {
        setCount(count() + 1);
      };
      const dec = () => {
        setCount(count() - 1);
      };

      return (
        <>
          <div data-testid="count">{count()}</div>
          <button data-testid="inc" onClick={inc}>+</button>
          <button data-testid="dec" onClick={dec}>-</button>
        </>
      );
    };

    render(() => <App />);

    const increment = await screen.findByTestId('inc');
    const decrement = await screen.findByTestId('dec');

    userEvent.click(increment);
    userEvent.click(increment);

    expect((await screen.findByTestId('count')).textContent).toBe('2');
    userEvent.click(decrement);
    expect((await screen.findByTestId('count')).textContent).toBe('1');
  });
});