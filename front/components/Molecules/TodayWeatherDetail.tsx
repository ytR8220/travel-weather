import { useRecoilValue } from 'recoil';
import InfoDetail from '../Atoms/InfoDetail';
import { weatherDataState } from '@/lib/globalState';

const TodayWeatherDetail = () => {
  const data = useRecoilValue<data[] | null>(weatherDataState);

  return (
    <ul className={'mt-5 flex justify-between text-xl gap-x-8 max-md:gap-x-2'}>
      <li>
        <InfoDetail
          color={'text-black'}
          title={'気温'}
          content={`${data?.[0] && Math.round(data[0].temp)}℃`}
        />
      </li>
      <li>
        <InfoDetail
          color={'text-red-600'}
          title={'最高気温'}
          content={`${data?.[0] && Math.round(data[0].temp_max)}℃`}
        />
      </li>
      <li>
        <InfoDetail
          color={'text-blue-600'}
          title={'最低気温'}
          content={`${data?.[0] && Math.round(data[0].temp_min)}℃`}
        />
      </li>
      <li>
        <InfoDetail
          color={'text-orange-600'}
          title={'湿度'}
          content={`${data?.[0] && Math.round(data[0].humidity)}%`}
        />
      </li>
    </ul>
  );
};

export default TodayWeatherDetail;
