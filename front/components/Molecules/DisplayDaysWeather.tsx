import {
  dayWeatherState,
  isLoadingState,
  weatherDataState,
} from '@/lib/globalState';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import DaysWeather from '../Atoms/DaysWeather';

const DisplayDaysWeather = () => {
  const dayWeather = useRecoilValue(dayWeatherState);
  const [dayUpdatedAt, setDayUpdatedAt] = useState('');
  const setIsLoading = useSetRecoilState(isLoadingState);
  const data = useRecoilValue<data[] | null>(weatherDataState);

  useEffect(() => {
    if (data?.[4]) {
      const date = new Date(data[4].updated_at);
      const hour = date.getHours();
      const minute = date.getMinutes();
      setDayUpdatedAt(`${hour}時${String(minute).padStart(2, '0')}分`);
      setIsLoading(false);
    }
  }, [data, setIsLoading]);

  const formatDay = (timeStamp: string) => {
    const date = new Date(timeStamp);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const dayOfWeek = date.getUTCDay();
    const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek];
    return { year, month, day, dayOfWeekStr };
  };

  const formatDayOfWeek = (timeStamp: string) => {
    const result = formatDay(timeStamp);
    return `${result.month}/${result.day}(${result.dayOfWeekStr})`;
  };

  return (
    <div
      className={
        'w-7/12 min-w-fit mt-14 mx-auto max-md:min-w-0 max-md:w-full max-md:overflow-auto'
      }
    >
      <div className={'max-md:overflow-auto'}>
        <ul className={'flex justify-between gap-1 max-md:gap-x-4 max-md:pb-4'}>
          {dayWeather.map((weather: any, index: number) => (
            <li key={index} className={'flex flex-col items-center'}>
              <p className={'text-gray-800 max-md:text-sm'}>
                {formatDayOfWeek(weather.date_time)}
              </p>
              <DaysWeather weatherData={weather} />
            </li>
          ))}
        </ul>
      </div>
      <p className={'mt-2 text-right text-gray-600 max-md:text-sm'}>
        {dayUpdatedAt && `最終更新時間：${dayUpdatedAt}`}
      </p>
    </div>
  );
};

export default DisplayDaysWeather;
