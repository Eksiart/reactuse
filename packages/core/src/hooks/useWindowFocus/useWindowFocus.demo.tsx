import { useWindowFocus } from '@siberiacancode/reactuse';

const Demo = () => {
  const windowFocused = useWindowFocus();

  return (
    <p>
      {windowFocused && (
        <>
          💡 Click somewhere outside of the document to <code>unfocus</code>
        </>
      )}
      {!windowFocused && (
        <>
          ℹ Tab is <code>unfocused</code>
        </>
      )}
    </p>
  );
};

export default Demo;
