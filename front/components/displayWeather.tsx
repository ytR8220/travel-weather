import Image from 'next/image';

type props = {
  weatherData: {
    description: string;
    icon: string;
    temp_max: number;
    temp_min: number;
  };
  iconSize: number;
  px: string;
};

const DisplayWeather: React.FC<props> = ({ weatherData, iconSize, px }) => {
  return (
    <div
      className={`flex flex-col items-center rounded-lg backdrop-blur-sm py-4 ${px}`}
    >
      <p>{weatherData.description}</p>
      <Image
        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
        alt={'sunny'}
        width={iconSize}
        height={iconSize}
      />
      <p>
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

export default DisplayWeather;
