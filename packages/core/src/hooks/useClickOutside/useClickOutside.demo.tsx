import { cn } from '@siberiacancode/docs/utils';
import { useClickOutside, useCounter } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();

  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    console.log('click outside');
    counter.inc();
  });

  return (
    <div>
      <p>
        Click more than five times: <code>{counter.value}</code>
      </p>

      <div
        ref={clickOutsideRef}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-red-500 p-12',
          { 'border-green-500': counter.value > 5 }
        )}
      >
        {counter.value <= 5 && 'Click outside'}
        {counter.value > 5 && counter.value <= 25 && 'Nice work'}
        {counter.value > 25 && 'That are a lot of clicks'}
      </div>
    </div>
  );
};

export default Demo;
