import {
  isLoadingState,
  timeWeatherState,
  weatherDataState,
} from '@/lib/globalState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import TimesWeather from '../Atoms/TimesWeather';
import { useEffect, useState } from 'react';

const DisplayTimesWeather = () => {
  const timeWeather = useRecoilValue(timeWeatherState);
  const [timeUpdatedAt, setTimeUpdatedAt] = useState('');
  const setIsLoading = useSetRecoilState(isLoadingState);
  const data = useRecoilValue<data[] | null>(weatherDataState);

  useEffect(() => {
    if (data?.[0]) {
      const date = new Date(data[0].updated_at);
      const hour = date.getHours();
      const minute = date.getMinutes();
      setTimeUpdatedAt(`${hour}時${String(minute).padStart(2, '0')}分`);
      setIsLoading(false);
    }
  }, [data, setIsLoading]);

  const formatTime = (timeStamp: string) => {
    const date = new Date(timeStamp);
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    return `${hour}:${String(minute).padStart(2, '0')}`;
  };

  return (
    <div
      className={
        'w-7/12 min-w-fit mt-14 mx-auto max-md:min-w-0 max-md:w-full max-md:overflow-auto'
      }
    >
      <div className={'max-md:overflow-auto'}>
        <ul className={'flex justify-between gap-4 max-md:pb-4'}>
          {timeWeather.map((weather: any, index: number) => (
            <li key={index} className={'flex flex-col items-center'}>
              <p className={'text-gray-800 max-md:text-sm'}>
                {formatTime(weather.date_time)}
              </p>
              <TimesWeather weatherData={weather} />
            </li>
          ))}
        </ul>
      </div>
      <p className={'mt-2 text-right text-gray-600 max-md:text-sm'}>
        {timeUpdatedAt && `最終更新時間：${timeUpdatedAt}`}
      </p>
    </div>
  );
};

export default DisplayTimesWeather;
