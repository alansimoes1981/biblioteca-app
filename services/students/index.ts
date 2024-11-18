import httpService from '../api';
import { IResponse } from 'types/IResponse';
import { IParamsUpdateStudent, IStudentInput, IStudentOutput } from 'types/IStudents';

export const ServiceStudents = {
  getAll: async (): Promise<IResponse<IStudentOutput[]>> => {
    const { data } = await httpService.get(`/students`);
    return data;
  },

  getBySearch: async ({
    studentName,
    status,
  }: {
    studentName?: string;
    status?: boolean | string;
  }): Promise<IResponse<IStudentOutput[]>> => {
    let urlPath = `/students?`;

    if (studentName !== '') {
      urlPath = urlPath.concat(`studentName=${studentName}&`);
    }

    if (status != undefined) {
      urlPath = urlPath.concat(`status=${status}&`);
    }

    const { data } = await httpService.get(urlPath);
    return data;
  },

  getById: async (id: string): Promise<IResponse<IStudentOutput>> => {
    const { data } = await httpService.get(`/students/${id}`);
    return data;
  },

  getByStatus: async (status: boolean): Promise<IResponse<IStudentOutput[]>> => {
    const { data } = await httpService.get(`/students/getByStatus/${status}`);
    return data;
  },

  create: async (body: IStudentInput): Promise<IResponse<null>> => {
    const { data } = await httpService.post(`/students`, body);
    return data;
  },

  update: async ({ id, body }: IParamsUpdateStudent): Promise<IResponse<null>> => {
    const { data } = await httpService.put(`/students/${id}`, body);
    return data;
  },

  delete: async (id: string): Promise<IResponse<null>> => {
    const { data } = await httpService.remove(`/students/${id}`);
    return data;
  },
};
