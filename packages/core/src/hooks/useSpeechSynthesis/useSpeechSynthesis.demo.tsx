import { useField, useMount, useSpeechSynthesis } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const textField = useField({ initialValue: 'Hello, everyone! Good morning!' });
  const pitchField = useField({ initialValue: 1 });
  const rateField = useField({ initialValue: 1 });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();

  const text = textField.watch();
  const pitch = pitchField.watch();
  const rate = rateField.watch();

  const speechSynthesis = useSpeechSynthesis({
    text,
    voice,
    pitch,
    rate
  });

  useMount(() => {
    if (!speechSynthesis.supported) return;

    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) setVoice(availableVoices[0]);
    };

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  });

  const play = () => {
    if (speechSynthesis.status === 'pause') {
      speechSynthesis.resume();
    } else {
      speechSynthesis.speak();
    }
  };

  if (!speechSynthesis.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-1'>
        <label className='mr-2 font-bold'>Spoken Text</label>
        <input {...textField.register()} disabled={speechSynthesis.playing} type='text' />
      </div>

      <div className='flex items-center gap-1'>
        <label className='mr-2 font-bold'>Language</label>

        <select
          disabled={speechSynthesis.playing}
          value={voices.indexOf(voice as SpeechSynthesisVoice)}
          onChange={(event) => setVoice(voices[Number.parseInt(event.target.value)])}
        >
          <option disabled>Select Language</option>
          {voices.map((voice, index) => (
            <option key={index} value={index}>
              {`${voice.name} (${voice.lang})`}
            </option>
          ))}
        </select>
      </div>

      <div className='flex items-center gap-1'>
        <label className='mr-2 font-bold'>Pitch</label>

        <input
          {...pitchField.register()}
          disabled={speechSynthesis.playing}
          max='2'
          min='0.5'
          step='0.1'
          type='range'
        />
      </div>

      <div className='flex items-center gap-1'>
        <label className='mr-2 font-bold'>Rate</label>
        <div className='mt-1 inline-flex'>
          <input
            {...rateField.register()}
            disabled={speechSynthesis.playing}
            max='2'
            min='0.5'
            step='0.1'
            type='range'
          />
        </div>
      </div>

      <div className='mt-2'>
        <button disabled={speechSynthesis.playing} onClick={play}>
          {speechSynthesis.status === 'pause' ? 'Resume' : 'Speak'}
        </button>
        <button
          className='orange'
          disabled={!speechSynthesis.playing}
          onClick={speechSynthesis.pause}
        >
          Pause
        </button>
        <button className='red' disabled={!speechSynthesis.playing} onClick={speechSynthesis.stop}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default Demo;
