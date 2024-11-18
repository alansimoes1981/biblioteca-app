import { IBodyLogin, IBodyRegister, IResponseLogin, IUser } from 'types/IAuth';
import httpService from '../api';
import { IResponse } from 'types/IResponse';
import { IOrderItemInput, IOrderItemOutput, IParamsUpdateOrderItem } from 'types/IOrderItems';

export const ServiceOrderItems = {
  getAll: async (): Promise<IResponse<IOrderItemOutput[]>> => {
    const { data } = await httpService.get(`/orderItems`);
    return data;
  },

  getBySearch: async ({
    studentName,
    status,
  }: {
    studentName?: string;
    status?: boolean | string;
  }): Promise<IResponse<IOrderItemOutput[]>> => {
    let urlPath = `/orderItems?`;

    if (studentName !== '') {
      urlPath = urlPath.concat(`studentName=${studentName}&`);
    }

    if (status != undefined) {
      urlPath = urlPath.concat(`status=${status}&`);
    }

    const { data } = await httpService.get(urlPath);
    return data;
  },

  create: async (body: IOrderItemInput): Promise<IResponse<null>> => {
    const { data } = await httpService.post(`/orderItems`, body);
    return data;
  },

  updateStatus: async ({ id, body }: IParamsUpdateOrderItem): Promise<IResponse<null>> => {
    const { data } = await httpService.put(`/orderItems/updateStatus/${id}`, body);
    return data;
  },
};
