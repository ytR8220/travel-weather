import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  inputCityState,
  getErrorState,
  errorMessageState,
  isLoadingState,
  timeWeatherState,
  dayWeatherState,
  weatherDataState,
  currentCityStat,
} from '@/lib/globalState';
import axios from 'axios';

const IfCity: React.FC<search> = ({ cityName }) => {
  const setInputCity = useSetRecoilState(inputCityState);
  const [getError, setGetError] = useRecoilState(getErrorState);
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setTimeWeather = useSetRecoilState(timeWeatherState);
  const setDayWeather = useSetRecoilState(dayWeatherState);
  const setData = useSetRecoilState(weatherDataState);
  const setCurrentCity = useSetRecoilState(currentCityStat);
  const setErrMessage = useSetRecoilState(errorMessageState);

  const handleSearch = async (searchName: string) => {
    setGetError(false);
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/get_weather_data`,
        { city: searchName },
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

  return (
    <p
      className={`${
        getError ? 'block' : 'hidden'
      } ${'pt-1'} ${'max-md:text-sm'}`}
    >
      他の候補：
      <span
        onClick={() => handleSearch(`${cityName}市`)}
        className={'underline text-blue-800 cursor-pointer'}
      >
        {cityName}市
      </span>
      、
      <span
        onClick={() => handleSearch(`${cityName}区`)}
        className={'underline text-blue-800 cursor-pointer'}
      >
        {cityName}区
      </span>
      、
      <span
        onClick={() => handleSearch(`${cityName}町`)}
        className={'underline text-blue-800 cursor-pointer'}
      >
        {cityName}町
      </span>
      、
      <span
        onClick={() => handleSearch(`${cityName}村`)}
        className={'underline text-blue-800 cursor-pointer'}
      >
        {cityName}村
      </span>
    </p>
  );
};

export default IfCity;
