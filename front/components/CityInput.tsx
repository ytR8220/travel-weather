import { useRef } from 'react';

type props = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CityInput: React.FC<props> = ({ name, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      type='text'
      name={name}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={'w-full py-2 px-4 focus:outline-none rounded-md'}
      placeholder={'市区町村名を入力　例）新宿区'}
    />
  );
};

export default CityInput;
