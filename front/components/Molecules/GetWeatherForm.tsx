import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useRef } from 'react';
import { inputCityState } from '@/lib/atoms/inputCityState';
import { getErrorState } from '@/lib/atoms/getErrorState';
import { composingState } from '@/lib/atoms/composingState';
import { disabledState } from '@/lib/atoms/disabledState';
import { errorMessageState } from '@/lib/atoms/errorMessageState';
import { isLoadingState } from '@/lib/atoms/isLoadingState';
import { timeWeatherState } from '@/lib/atoms/timeWeatherState';
import { dayWeatherState } from '@/lib/atoms/dayWeatherState';
import { weatherDataState } from '@/lib/atoms/weatherDataState';
import { currentCityStat } from '@/lib/atoms/currentCityState';
import axios from 'axios';
import CityInput from '../Atoms/CityInput';
import GetBtn from '../Atoms/GetBtn';

const GetWeatherForm = () => {
  const [inputCity, setInputCity] = useRecoilState(inputCityState);
  const [isComposing, setIsComposing] = useRecoilState(composingState);
  const [getError, setGetError] = useRecoilState(getErrorState);
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setTimeWeather = useSetRecoilState(timeWeatherState);
  const setDayWeather = useSetRecoilState(dayWeatherState);
  const setData = useSetRecoilState(weatherDataState);
  const setCurrentCity = useSetRecoilState(currentCityStat);
  const [errMessage, setErrMessage] = useRecoilState(errorMessageState);
  const disabled = useRecoilValue(disabledState);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGetError(false);
    setInputCity(e.target.value);
  };

  const getWeather = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/get_weather_data`,
        { city: inputCity },
      );
      setTimeWeather(res?.data.weather_data.slice(0, 4));
      setDayWeather(res?.data.weather_data.slice(4));
      setData(res?.data.weather_data);
      setCurrentCity(res?.data.city_name);
    } catch (err: any) {
      setGetError(true);
      setErrMessage(err.response.data?.error);
      setIsLoading(false);
      setData(null);
    }
    setInputCity('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      getWeather();
      inputRef.current?.blur();
    }
  };

  return (
    <form className={'w-full'}>
      <div
        className={
          'w-6/12 max-lg:w-full min-w-fit mx-auto mt-7 flex justify-center gap-5'
        }
      >
        <div className={'w-3/4 max-md:w-full'}>
          <CityInput
            inputRef={inputRef}
            name={'city'}
            value={inputCity}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
          <p
            className={`${
              getError ? 'block text-red-600' : 'hidden'
            } ${'pt-1'} ${'max-md:text-sm'}`}
          >
            {errMessage && errMessage}
          </p>
        </div>
        <GetBtn onClick={getWeather} disabled={disabled} />
      </div>
    </form>
  );
};

export default GetWeatherForm;
