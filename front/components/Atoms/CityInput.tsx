type props = {
  inputRef: React.RefObject<HTMLInputElement>;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCompositionStart: (e: React.CompositionEvent<HTMLInputElement>) => void;
  onCompositionEnd: (e: React.CompositionEvent<HTMLInputElement>) => void;
};

const CityInput: React.FC<props> = ({
  inputRef,
  name,
  value,
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
}) => {
  return (
    <input
      ref={inputRef}
      type='text'
      name={name}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      className={'w-full py-2 px-4 focus:outline-none rounded-md'}
      placeholder={'市区町村名を入力　例）新宿区'}
    />
  );
};

export default CityInput;
