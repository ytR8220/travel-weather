type props = {
  onClick: () => void;
  disabled: boolean;
};

const GetBtn: React.FC<props> = ({ onClick, disabled }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`h-10 rounded-md bg-blue-500 hover:opacity-70 transition duration-300 text-white py-2 px-4 text-lg max-md:hidden ${
        disabled ? 'bg-gray-500 opacity-50 cursor-not-allowed' : ''
      }}`}
      disabled={disabled}
    >
      天気を取得
    </button>
  );
};

export default GetBtn;
