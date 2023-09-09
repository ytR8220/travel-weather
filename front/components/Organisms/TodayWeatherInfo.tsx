import { useRecoilValue } from 'recoil';
import Alert from '../Atoms/Alert';
import InfoTitle from '../Atoms/InfoTitle';
import TodayWeatherDetail from '../Molecules/TodayWeatherDetail';
import { weatherDataState } from '@/lib/globalState';

const TodayWeatherInfo = () => {
  const data = useRecoilValue<data[] | null>(weatherDataState);

  return (
    <div className={'w-7/12 min-w-fit mx-auto'}>
      <InfoTitle />
      {data?.[0].alert && <Alert />}
      <TodayWeatherDetail />
    </div>
  );
};

export default TodayWeatherInfo;
