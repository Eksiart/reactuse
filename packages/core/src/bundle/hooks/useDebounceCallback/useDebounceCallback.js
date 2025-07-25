import { useMemo, useRef } from 'react';
/**
 * @name useDebounceCallback
 * @description - Hook that creates a debounced callback
 * @category Utilities
 *
 * @template Params The type of the params
 * @template Return The type of the return
 * @param {(...args: Params) => Return} callback The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {(...args: Params) => Return} The callback with debounce
 *
 * @example
 * const debouncedCallback = useDebounceCallback(() => console.log('callback'), 500);
 */
export const useDebounceCallback = (callback, delay) => {
  const internalCallbackRef = useRef(callback);
  const timerRef = useRef(null);
  const delayRef = useRef(delay);
  internalCallbackRef.current = callback;
  delayRef.current = delay;
  const debounced = useMemo(() => {
    const cancel = () => {
      if (!timerRef.current) return;
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };
    const debouncedCallback = function (...args) {
      cancel();
      timerRef.current = setTimeout(() => {
        internalCallbackRef.current.apply(this, args);
      }, delayRef.current);
    };
    debouncedCallback.cancel = cancel;
    return debouncedCallback;
  }, []);
  return debounced;
};
