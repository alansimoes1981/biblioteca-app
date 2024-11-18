import { IBodyLogin, IBodyRegister, IResponseLogin, IUser } from 'types/IAuth';
import httpService from '../api';
import { IResponse } from 'types/IResponse';
import { ICollectionInput, ICollectionOutput, IParamsUpdateCollection } from 'types/ICollections';

export const ServiceCollections = {
  getAll: async (): Promise<IResponse<ICollectionOutput[]>> => {
    const { data } = await httpService.get(`/collections`);
    return data;
  },

  getByStatus: async (status: boolean): Promise<IResponse<ICollectionOutput[]>> => {
    const { data } = await httpService.get(`/collections/getByStatus/${status}`);
    return data;
  },

  getById: async (id: string): Promise<IResponse<ICollectionOutput>> => {
    const { data } = await httpService.get(`/collections/${id}`);
    return data;
  },
  getBySearch: async (search: string): Promise<IResponse<ICollectionOutput[]>> => {
    const { data } = await httpService.get(`/collections/getByTitleOrAuthor/${search}`);
    return data;
  },

  create: async (body: ICollectionInput): Promise<IResponse<null>> => {
    const { data } = await httpService.post(`/collections`, body);
    return data;
  },

  update: async ({ id, body }: IParamsUpdateCollection): Promise<IResponse<null>> => {
    const { data } = await httpService.put(`/collections/${id}`, body);
    return data;
  },

  delete: async (id: string): Promise<IResponse<null>> => {
    const { data } = await httpService.remove(`/collections/${id}`);
    return data;
  },
};
