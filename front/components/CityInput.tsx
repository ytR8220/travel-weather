type props = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CityInput: React.FC<props> = ({ name, value, onChange }) => {
  return (
    <input
      type='text'
      name={name}
      value={value}
      onChange={onChange}
      className={'w-full py-2 px-4 focus:outline-none rounded-md'}
      placeholder={'市区町村名を入力　例）新宿区'}
    />
  );
};

export default CityInput;
