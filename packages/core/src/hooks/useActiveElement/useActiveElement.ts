import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

export interface UseActiveElement {
  (): HTMLElement | null;

  <Target extends Element, ActiveElement extends HTMLElement = HTMLElement>(
    target?: never
  ): {
    ref: StateRef<Target>;
    value: ActiveElement | null;
  };

  <ActiveElement extends HTMLElement = HTMLElement>(target: HookTarget): ActiveElement | null;
}

/**
 * @name useActiveElement
 * @description - Hook that returns the active element
 * @category Elements
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to observe active element changes
 * @returns {ActiveElement | null} The active element
 *
 * @example
 * const activeElement = useActiveElement(ref);
 *
 * @overload
 * @template ActiveElement The active element type
 * @returns {{ ref: StateRef<Element>; activeElement: ActiveElement | null }} An object containing the ref and active element
 *
 * @example
 * const { ref, value } = useActiveElement();
 *
 * @see {@link https://siberiacancode.github.io/reactuse/functions/hooks/useActiveElement.html}
 */
export const useActiveElement = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const [value, setValue] = useState<HTMLElement | null>(null);
  const internalRef = useRefState(window);

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const observer = new MutationObserver((mutations) => {
      mutations
        .filter((mutation) => mutation.removedNodes.length)
        .map((mutation) => Array.from(mutation.removedNodes))
        .flat()
        .forEach((node) => {
          setValue((prevActiveElement) => {
            if (node === prevActiveElement) return document.activeElement as HTMLElement | null;
            return prevActiveElement;
          });
        });
    });

    observer.observe(element, {
      childList: true,
      subtree: true
    });

    const onActiveElementChange = () => setValue(document?.activeElement as HTMLElement | null);

    element.addEventListener('focus', onActiveElementChange, true);
    element.addEventListener('blur', onActiveElementChange, true);

    return () => {
      observer.disconnect();
      element.removeEventListener('focus', onActiveElementChange, true);
      element.removeEventListener('blur', onActiveElementChange, true);
    };
  }, [target, internalRef.state]);

  if (target) return value;
  return {
    ref: internalRef,
    value
  };
}) as UseActiveElement;
