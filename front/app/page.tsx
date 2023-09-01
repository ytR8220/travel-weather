'use client';

import CityInput from '@/components/cityinput';
import GetBtn from '@/components/getbtn';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';

const fetcher = async (args: [string, string]) => {
  const [url, city] = args;
  const res = await axios.post(url, { city });
  return res.data;
};

export default function Home() {
  const [inputCity, setInputCity] = useState('');
  const [timeWeather, setTimeWeather] = useState([]);
  const [dayWeather, setDayWeather] = useState([]);
  const [getError, setGetError] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    console.log(123);
    inputCity.length > 0 ? setDisabled(false) : setDisabled(true);
  }, [inputCity]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // getMonth()は0ベースなので1を加える
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
    } catch (err) {
      setGetError(true);
    }
    setInputCity('');
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
            'container xl max-w-7xl min-h-2/4 rounded-xl backdrop-blur-md bg-white/40 p-10'
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
          <div className={'w-7/12 min-w-fit mt-7 mx-auto'}>
            <p className={'text-3xl font-bold text-gray-700 text-center'}>
              <span>{formattedDate}</span>の<span>那覇市</span>の天気
            </p>
            <p className={'mt-7 text-xl'}>
              警報：
              <span className={'text-gray-800'}>特にありません。</span>
            </p>
            <ul className={'mt-3 flex justify-between text-xl gap-x-8'}>
              <li>
                気温<span className={'ml-5'}>31</span>℃
              </li>
              <li className={'text-red-600'}>
                最高気温<span className={'ml-5'}>31</span>℃
              </li>
              <li className={'text-blue-600'}>
                最低気温<span className={'ml-5'}>31</span>℃
              </li>
              <li className={'text-orange-600'}>
                湿度<span className={'ml-5'}>31</span>%
              </li>
            </ul>
          </div>
          <ul
            className={
              'w-7/12 min-w-fit mt-14 mx-auto flex justify-between gap-4'
            }
          >
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>現在</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-6'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={100}
                  height={100}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>3時間後</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-6'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={100}
                  height={100}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>6時間後</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-6'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={100}
                  height={100}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>12時間後</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-6'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={100}
                  height={100}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
          </ul>
          <ul
            className={
              'w-7/12 min-w-fit mt-10 mx-auto flex justify-between gap-1'
            }
          >
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>9/1</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-4'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={60}
                  height={60}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>9/2</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-4'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={60}
                  height={60}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>9/3</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-4'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={60}
                  height={60}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>9/4</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-4'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={60}
                  height={60}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
            <li className={'flex flex-col items-center'}>
              <p className={'text-gray-800'}>9/5</p>
              <div
                className={
                  'flex flex-col items-center rounded-lg backdrop-blur-sm py-4 px-4'
                }
              >
                <p>雨のち晴れ</p>
                <Image
                  src={'https://openweathermap.org/img/wn/10d@2x.png'}
                  alt={'sunny'}
                  width={60}
                  height={60}
                />
                <p>
                  <span className={'text-red-600'}>31℃</span>／
                  <span className={'text-blue-600'}>28℃</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
