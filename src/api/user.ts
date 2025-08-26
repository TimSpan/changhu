import {api} from './request';

export const getUserInfo = () => {
  return api.get('/common/enums');
};
