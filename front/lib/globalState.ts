import { atom } from 'recoil';

export const composingState = atom({
  key: 'composing',
  default: false,
});

export const currentCityStat = atom({
  key: 'currentCityStat',
  default: '',
});

export const dayWeatherState = atom({
  key: 'dayWeatherState',
  default: [],
});

export const disabledState = atom({
  key: 'disabledState',
  default: true,
});

export const errorMessageState = atom({
  key: 'errorMessageState',
  default: '',
});

export const getErrorState = atom({
  key: 'getError',
  default: false,
});

export const inputCityState = atom({
  key: 'inputCityState',
  default: '',
});

export const isLoadingState = atom({
  key: 'isLoading',
  default: false,
});

export const timeWeatherState = atom({
  key: 'timeWeatherState',
  default: [],
});

export const weatherDataState: any = atom({
  key: 'weatherDataState',
  default: [],
});
