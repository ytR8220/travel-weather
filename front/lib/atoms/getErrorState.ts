import { atom } from 'recoil';

export const getErrorState = atom({
  key: 'getError',
  default: false,
});
