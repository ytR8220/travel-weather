'use client';

import CityInput from '@/components/cityinput';
import GetBtn from '@/components/getbtn';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

export default function Home() {
  const [inputCity, setInputCity] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [data, setData] = useState<data[] | null>(null);
  const [timeWeather, setTimeWeather] = useState([]);
  const [dayWeather, setDayWeather] = useState([]);
  const [getError, setGetError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [timeUpdatedAt, setTimeUpdatedAt] = useState('');
  const [dayUpdatedAt, setDayUpdatedAt] = useState('');

  useEffect(() => {
    inputCity.length > 0 ? setDisabled(false) : setDisabled(true);
  }, [inputCity]);

  useEffect(() => {
    if (data?.[0]) {
      const date = new Date(data[0].updated_at);
      date.setUTCDate(date.getUTCDate() + 9);
      const hour = date.getHours();
      const minute = date.getMinutes();
      setTimeUpdatedAt(`${hour}時${String(minute).padStart(2, '0')}分`);
    }
  }, [data]);

  useEffect(() => {
    if (data?.[4]) {
      const date = new Date(data[4].updated_at);
      date.setUTCDate(date.getUTCDate() + 9);
      const hour = date.getHours();
      const minute = date.getMinutes();
      setDayUpdatedAt(`${hour}時${String(minute).padStart(2, '0')}分`);
    }
  }, [data]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${year}年${month}月${day}日`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGetError(false);
    setInputCity(e.target.value);
  };

  const getWeather = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/get_weather_data`,
        { city: inputCity },
      );
      setTimeWeather(res?.data.slice(0, 4));
      setDayWeather(res?.data.slice(4));
      setData(res?.data);
    } catch (err) {
      setGetError(true);
    }
    setCurrentCity(inputCity);
    setInputCity('');
  };

  const timeIndex = (index: number) => {
    switch (index) {
      case 0:
        return '現在';
      case 1:
        return '3時間後';
      case 2:
        return '6時間後';
      case 3:
        return '12時間後';
    }
  };

  const dayIndex = () => {
    today.setDate(today.getDate() + 1);
    return `${today.getMonth() + 1}/${today.getDate()}`;
  };

  return (
    <div
      className={"bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat"}
      style={{ backgroundPositionY: '40%' }}
    >
      <div
        className={'p-10 min-h-screen h-full flex justify-center items-center'}
      >
        <div
          className={
            'container xl max-w-7xl rounded-xl backdrop-blur-md bg-white/40 px-10 py-20'
          }
        >
          <h1
            className={
              'font-serif text-5xl text-center font-bold text-gray-900'
            }
          >
            Travel Weather
          </h1>
          <div
            className={
              'w-6/12 max-lg:w-full min-w-fit mx-auto mt-7 flex justify-center gap-5'
            }
          >
            <div className={'w-3/4'}>
              <CityInput
                name={'city'}
                value={inputCity}
                onChange={handleChange}
              />
              <p className={getError ? 'block text-red-600' : 'hidden'}>
                入力された市区町村名が正しくないようです。
              </p>
            </div>
            <GetBtn onClick={getWeather} disabled={disabled} />
          </div>
          {data?.[0] && (
            <div className={'w-7/12 min-w-fit mt-7 mx-auto'}>
              <p className={'text-3xl font-bold text-gray-700 text-center'}>
                <span>{formattedDate}</span>の<span>{currentCity}</span>の天気
              </p>
              {data?.[0].alert && (
                <p className={'mt-7 text-xl'}>
                  警報：{data?.[0].alert}
                  <span className={'text-gray-800'}></span>
                </p>
              )}
              <ul className={'mt-3 flex justify-between text-xl gap-x-8'}>
                <li>
                  気温
                  <span className={'ml-5'}>
                    {data?.[0] && Math.round(data[0].temp)}
                  </span>
                  ℃
                </li>
                <li className={'text-red-600'}>
                  最高気温
                  <span className={'ml-5'}>
                    {data?.[0] && Math.round(data[0].temp_max)}
                  </span>
                  ℃
                </li>
                <li className={'text-blue-600'}>
                  最低気温
                  <span className={'ml-5'}>
                    {data?.[0] && Math.round(data[0].temp_min)}
                  </span>
                  ℃
                </li>
                <li className={'text-orange-600'}>
                  湿度
                  <span className={'ml-5'}>
                    {data?.[0] && Math.round(data[0].humidity)}
                  </span>
                  %
                </li>
              </ul>
            </div>
          )}
          {data?.[0] && (
            <>
              <div className={'w-7/12 min-w-fit mt-14 mx-auto'}>
                <ul className={'flex justify-between gap-4'}>
                  {timeWeather.map((weather: any, index: number) => (
                    <li key={index} className={'flex flex-col items-center'}>
                      <p className={'text-gray-800'}>{timeIndex(index)}</p>
                      <div
                        className={
                          'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-6'
                        }
                      >
                        <p>{weather.description}</p>
                        <Image
                          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                          alt={'sunny'}
                          width={100}
                          height={100}
                        />
                        <p>
                          <span className={'text-red-600'}>
                            {Math.round(weather.temp_max)}℃
                          </span>
                          ／
                          <span className={'text-blue-600'}>
                            {Math.round(weather.temp_min)}℃
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className={'mt-2 text-right text-gray-600'}>
                  {timeUpdatedAt && `最終更新時間：${timeUpdatedAt}`}
                </p>
              </div>
              <div className={'w-7/12 min-w-fit mt-10 mx-auto'}>
                <ul className={'flex justify-between gap-1'}>
                  {dayWeather.map((weather: any, index: number) => (
                    <li key={index} className={'flex flex-col items-center'}>
                      <p className={'text-gray-800'}>{dayIndex()}</p>
                      <div
                        className={
                          'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-4'
                        }
                      >
                        <p>{weather.description}</p>
                        <Image
                          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                          alt={'sunny'}
                          width={60}
                          height={60}
                        />
                        <p>
                          <span className={'text-red-600'}>
                            {Math.round(weather.temp_max)}℃
                          </span>
                          ／
                          <span className={'text-blue-600'}>
                            {Math.round(weather.temp_min)}℃
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className={'mt-2 text-right text-gray-600'}>
                  {dayUpdatedAt && `最終更新時間：${dayUpdatedAt}`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
