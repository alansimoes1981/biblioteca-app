import { IBodyLogin, IBodyRegister, IResponseLogin, IUser } from 'types/IAuth';
import httpService from '../api';
import { IResponse } from 'types/IResponse';

export const ServiceAuth = {
  signIn: async (body: IBodyLogin): Promise<IResponse<IResponseLogin>> => {
    const { data } = await httpService.post(`/login`, body);
    return data;
  },

  register: async (body: IBodyRegister): Promise<IResponse<IUser>> => {
    const { data } = await httpService.post(`/users`, body);
    return data;
  },
};
