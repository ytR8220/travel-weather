import { useRecoilValue } from 'recoil';
import IsLoading from '../Atoms/IsLoading';
import DisplayDaysWeather from '../Molecules/DisplayDaysWeather';
import DisplayTimesWeather from '../Molecules/DisplayTimesWeather';
import TodayWeatherInfo from '../Organisms/TodayWeatherInfo';
import { isLoadingState, weatherDataState } from '@/lib/globalState';

const MainContent = () => {
  const isLoading = useRecoilValue(isLoadingState);
  const data = useRecoilValue<data[] | null>(weatherDataState);
  return (
    <div className={'mt-7 mx-auto relative'}>
      {isLoading && <IsLoading />}
      {data?.[0] && (
        <>
          <TodayWeatherInfo />
          <DisplayTimesWeather />
          <DisplayDaysWeather />
        </>
      )}
    </div>
  );
};

export default MainContent;
