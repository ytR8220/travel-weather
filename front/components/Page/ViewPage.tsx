'use client';

import { useEffect, useState } from 'react';
import DisplayTimesWeather from '@/components/DisplayTimesWeather';
import DisplayDaysWeather from '@/components/DisplayDaysWeather';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  inputCityState,
  weatherDataState,
  currentCityStat,
  disabledState,
  timeWeatherState,
  dayWeatherState,
  isLoadingState,
} from '@/lib/globalState';
import GetWeatherForm from '../Molecules/GetWeatherForm';

type data = {
  id: number;
  city_id: number;
  date_time: string;
  temp: number;
  temp_max: number;
  temp_min: number;
  humidity: number;
  description: string;
  alert: string;
  icon: string;
  created_at: string;
  updated_at: string;
  weather: string;
};

const ViewPage = () => {
  const inputCity = useRecoilValue(inputCityState);
  const currentCity = useRecoilValue(currentCityStat);
  const data = useRecoilValue<data[] | null>(weatherDataState);
  const timeWeather = useRecoilValue(timeWeatherState);
  const dayWeather = useRecoilValue(dayWeatherState);
  const setDisabled = useSetRecoilState(disabledState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [timeUpdatedAt, setTimeUpdatedAt] = useState('');
  const [dayUpdatedAt, setDayUpdatedAt] = useState('');

  useEffect(() => {
    inputCity.length > 0 ? setDisabled(false) : setDisabled(true);
  }, [inputCity, setDisabled]);

  useEffect(() => {
    if (data?.[0]) {
      const date = new Date(data[0].updated_at);
      const hour = date.getHours();
      const minute = date.getMinutes();
      setTimeUpdatedAt(`${hour}時${String(minute).padStart(2, '0')}分`);
      setIsLoading(false);
    }
  }, [data, setIsLoading]);

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

  const formatToday = () => {
    const today = data?.[0] ? data?.[0].date_time : '';
    const result = formatDay(today);
    return `${result.year}年${result.month}月${result.day}日(${result.dayOfWeekStr})`;
  };

  const formatTime = (timeStamp: string) => {
    const date = new Date(timeStamp);
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    return `${hour}:${String(minute).padStart(2, '0')}`;
  };

  const formatDayOfWeek = (timeStamp: string) => {
    const result = formatDay(timeStamp);
    return `${result.month}/${result.day}(${result.dayOfWeekStr})`;
  };

  return (
    <>
      <h1
        className={
          'font-serif text-5xl text-center font-bold text-gray-900 max-md:text-3xl'
        }
      >
        Travel Weather
      </h1>
      <GetWeatherForm />
      <div className={'mt-7 mx-auto relative'}>
        {isLoading && (
          <div
            className={
              'w-2/3 h-full absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 backdrop-blur-md bg-white/30 rounded-xl z-10 max-md:w-full'
            }
          >
            <p
              className={
                'text-xl absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4'
              }
            >
              Now Loading...
            </p>
          </div>
        )}
        {data?.[0] && (
          <>
            <div className={'w-7/12 min-w-fit mx-auto'}>
              <p
                className={
                  'text-3xl font-bold text-gray-700 text-center max-md:text-lg'
                }
              >
                {formatToday()}
                <span>の</span>
                {currentCity}の天気
              </p>
              {data?.[0].alert && (
                <p className={'mt-7 text-xl'}>
                  警報：{data?.[0].alert}
                  <span className={'text-gray-800'}></span>
                </p>
              )}
              <ul
                className={
                  'mt-5 flex justify-between text-xl gap-x-8 max-md:gap-x-2'
                }
              >
                <li
                  className={
                    'max-md:flex max-md:flex-col max-md:items-center max-md:text-sm'
                  }
                >
                  気温
                  <span className={'ml-5 max-md:ml-0 max-md:text-base'}>
                    {data?.[0] && Math.round(data[0].temp)}℃
                  </span>
                </li>
                <li
                  className={
                    'text-red-600 max-md:flex max-md:flex-col max-md:items-center max-md:text-sm'
                  }
                >
                  最高気温
                  <span className={'ml-5 max-md:ml-0 max-md:text-base'}>
                    {data?.[0] && Math.round(data[0].temp_max)}℃
                  </span>
                </li>
                <li
                  className={
                    'text-blue-600 max-md:flex max-md:flex-col max-md:items-center max-md:text-sm'
                  }
                >
                  最低気温
                  <span className={'ml-5 max-md:ml-0 max-md:text-base'}>
                    {data?.[0] && Math.round(data[0].temp_min)}℃
                  </span>
                </li>
                <li
                  className={
                    'text-orange-600 max-md:flex max-md:flex-col max-md:items-center max-md:text-sm'
                  }
                >
                  湿度
                  <span className={'ml-5 max-md:ml-0 max-md:text-base'}>
                    {data?.[0] && Math.round(data[0].humidity)}%
                  </span>
                </li>
              </ul>
            </div>
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
                      <DisplayTimesWeather weatherData={weather} />
                    </li>
                  ))}
                </ul>
              </div>
              <p className={'mt-2 text-right text-gray-600 max-md:text-sm'}>
                {timeUpdatedAt && `最終更新時間：${timeUpdatedAt}`}
              </p>
            </div>
            <div
              className={
                'w-7/12 min-w-fit mt-14 mx-auto max-md:min-w-0 max-md:w-full max-md:overflow-auto'
              }
            >
              <div className={'max-md:overflow-auto'}>
                <ul
                  className={
                    'flex justify-between gap-1 max-md:gap-x-4 max-md:pb-4'
                  }
                >
                  {dayWeather.map((weather: any, index: number) => (
                    <li key={index} className={'flex flex-col items-center'}>
                      <p className={'text-gray-800 max-md:text-sm'}>
                        {formatDayOfWeek(weather.date_time)}
                      </p>
                      <DisplayDaysWeather weatherData={weather} />
                    </li>
                  ))}
                </ul>
              </div>
              <p className={'mt-2 text-right text-gray-600 max-md:text-sm'}>
                {dayUpdatedAt && `最終更新時間：${dayUpdatedAt}`}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ViewPage;
