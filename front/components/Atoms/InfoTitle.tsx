import { currentCityStat, weatherDataState } from '@/lib/globalState';
import { useRecoilValue } from 'recoil';

const formatDay = (timeStamp: string) => {
  const date = new Date(timeStamp);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const dayOfWeek = date.getUTCDay();
  const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek];
  return { year, month, day, dayOfWeekStr };
};

const InfoTitle = () => {
  const currentCity = useRecoilValue(currentCityStat);
  const data = useRecoilValue<data[] | null>(weatherDataState);

  const formatToday = () => {
    const today = data?.[0] ? data?.[0].date_time : '';
    const result = formatDay(today);
    return `${result.year}年${result.month}月${result.day}日(${result.dayOfWeekStr})`;
  };
  return (
    <p
      className={'text-3xl font-bold text-gray-700 text-center max-md:text-lg'}
    >
      {formatToday()}
      <span>の</span>
      {currentCity}の天気
    </p>
  );
};

export default InfoTitle;
