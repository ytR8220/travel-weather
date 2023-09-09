import { weatherDataState } from '@/lib/globalState';
import { useRecoilValue } from 'recoil';

const Alert = () => {
  const data = useRecoilValue<data[] | null>(weatherDataState);

  return (
    <p className={'mt-7 text-xl'}>
      警報：{data?.[0].alert}
      <span className={'text-gray-800'}></span>
    </p>
  );
};

export default Alert;
