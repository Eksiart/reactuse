import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useStopwatch } from './useStopwatch';

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

it('Should use stopwatch ', () => {
  const { result } = renderHook(useStopwatch);

  expect(result.current.days).toBe(0);
  expect(result.current.hours).toBe(0);
  expect(result.current.minutes).toBe(0);
  expect(result.current.seconds).toBe(0);
  expect(result.current.count).toBe(0);
  expect(result.current.paused).toBe(true);
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
});

it('Should start counting when enabled', () => {
  const { result } = renderHook(useStopwatch);

  expect(result.current.seconds).toBe(0);

  act(() => result.current.start());

  expect(result.current.paused).toBe(false);

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);
  expect(result.current.minutes).toBe(0);
  expect(result.current.count).toBe(1000);

  act(() => vi.advanceTimersByTime(59000));

  expect(result.current.seconds).toBe(0);
  expect(result.current.minutes).toBe(1);
  expect(result.current.count).toBe(60_000);
});

it('Should handle initial time correctly', () => {
  const { result } = renderHook(() => useStopwatch(90_061_000));

  expect(result.current.seconds).toBe(1);
  expect(result.current.minutes).toBe(1);
  expect(result.current.hours).toBe(1);
  expect(result.current.days).toBe(1);
  expect(result.current.count).toBe(90_061_000);
});

it('Should handle initial time with options object', () => {
  const { result } = renderHook(() => useStopwatch({ initialTime: 90_061_000 }));

  expect(result.current.seconds).toBe(1);
  expect(result.current.minutes).toBe(1);
  expect(result.current.hours).toBe(1);
  expect(result.current.days).toBe(1);
  expect(result.current.count).toBe(90_061_000);
});

it('Should respect immediately option', () => {
  const { result } = renderHook((immediately) => useStopwatch({ immediately, initialTime: 1000 }), {
    initialProps: true
  });

  expect(result.current.paused).toBe(false);
});

it('Should pause and resume correctly', () => {
  const { result } = renderHook(useStopwatch);

  act(() => result.current.start());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);

  act(() => result.current.pause());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);

  act(() => result.current.start());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(2);
});

it('Should toggle pause state', () => {
  const { result } = renderHook(useStopwatch);

  expect(result.current.paused).toBe(true);

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(0);

  act(() => result.current.toggle());

  expect(result.current.paused).toBe(false);

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);

  act(() => result.current.toggle());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(1);

  expect(result.current.paused).toBe(true);
});

it('Should reset to initial time', () => {
  const { result } = renderHook(() => useStopwatch(1000));

  expect(result.current.seconds).toBe(1);

  act(() => result.current.start());

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.seconds).toBe(2);

  act(() => result.current.reset());

  expect(result.current.seconds).toBe(1);
});

it('Should cleanup interval on unmount', () => {
  const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
  const { result, unmount } = renderHook(useStopwatch);

  act(() => result.current.start());

  unmount();

  expect(clearIntervalSpy).toHaveBeenCalled();
  clearIntervalSpy.mockRestore();
});
