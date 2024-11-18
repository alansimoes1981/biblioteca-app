import { useMutation, UseMutationResult, useQuery } from 'react-query';
import { ServiceStudents } from 'services/students';
import { IMutationOptionsRequest } from 'types/IReactQuery';
import { IResponse } from 'types/IResponse';
import { IParamsUpdateStudent, IStudentInput, IStudentOutput } from 'types/IStudents';

export const useGetStudentsByStatus = (status: boolean) => {
  return useQuery(['studentsByStatus'], () => ServiceStudents.getByStatus(status), {
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    cacheTime: 0,
    retry: false,
  });
};

export const useGetAllStudents = () => {
  return useQuery(['allStudents'], () => ServiceStudents.getAll(), {
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    cacheTime: 0,
    retry: false,
  });
};

export const useGetStudentById = (id: string) => {
  return useQuery(['studentById'], () => ServiceStudents.getById(id), {
    enabled: id !== undefined ? true : false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    cacheTime: 0,
    retry: false,
  });
};

export const useGetStudentsBySearch = (
  options?: IMutationOptionsRequest
): UseMutationResult<
  IResponse<IStudentOutput[]>,
  any,
  {
    studentName?: string;
    status?: boolean | string;
  },
  unknown
> => {
  return useMutation(ServiceStudents.getBySearch, options);
};

export const useCreateStudent = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<null>, any, IStudentInput, unknown> => {
  return useMutation(ServiceStudents.create, options);
};

export const useUpdateStudent = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<null>, any, IParamsUpdateStudent, unknown> => {
  return useMutation(ServiceStudents.update, options);
};
