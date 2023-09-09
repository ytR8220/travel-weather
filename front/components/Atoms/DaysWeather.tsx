import Image from 'next/image';

type props = {
  weatherData: {
    description: string;
    icon: string;
    temp_max: number;
    temp_min: number;
  };
};

const DaysWeather: React.FC<props> = ({ weatherData }) => {
  return (
    <div
      className={
        'flex flex-col items-center rounded-lg bg-gray-200/10 backdrop-blur-sm drop-shadow-md py-4 px-4 max-md:py-2 max-md:px-4 max-md:w-32'
      }
    >
      <p>{weatherData.description}</p>
      <Image
        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
        alt={'sunny'}
        width={60}
        height={60}
      />
      <p className={'max-md:text-sm'}>
        <span className={'text-red-600'}>
          {Math.round(weatherData.temp_max)}℃
        </span>
        ／
        <span className={'text-blue-600'}>
          {Math.round(weatherData.temp_min)}℃
        </span>
      </p>
    </div>
  );
};

export default DaysWeather;
