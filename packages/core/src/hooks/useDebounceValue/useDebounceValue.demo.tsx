import { useCounter, useDebounceValue } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();

  const debouncedCounterCount = useDebounceValue(counter.value, 500);

  return (
    <div>
      <p>
        Value: <code>{counter.value}</code>
      </p>
      <p>
        Debounced value: <code>{debouncedCounterCount}</code>
      </p>
      <button type='button' onClick={() => counter.inc()}>
        Increment
      </button>
      <button type='button' onClick={() => counter.dec()}>
        Decrement
      </button>
    </div>
  );
};

export default Demo;
