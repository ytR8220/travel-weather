import Image from 'next/image';

type props = {
  weatherData: {
    description: string;
    icon: string;
    temp: number;
  };
};

const TimesWeather: React.FC<props> = ({ weatherData }) => {
  return (
    <div
      className={
        'flex flex-col items-center rounded-lg bg-gray-200/10 backdrop-blur-sm drop-shadow-md py-4 px-6 max-md:py-2 max-md:px-4 max-md:w-28'
      }
    >
      <p className={'max-md:text-sm'}>{weatherData.description}</p>
      <Image
        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
        alt={'sunny'}
        width={100}
        height={100}
        className={'max-md:w-16 max-md:h-16'}
      />
      <p className={'max-md:text-sm'}>
        <span>{Math.round(weatherData.temp)}℃</span>
      </p>
    </div>
  );
};

export default TimesWeather;
