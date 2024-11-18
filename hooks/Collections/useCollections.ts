import { useMutation, UseMutationResult, useQuery } from 'react-query';
import { ServiceCollections } from 'services/collections';
import { ICollectionInput, ICollectionOutput, IParamsUpdateCollection } from 'types/ICollections';
import { IMutationOptionsRequest } from 'types/IReactQuery';
import { IResponse } from 'types/IResponse';

export const useGetAllCollections = () => {
  return useQuery(['allCollections'], () => ServiceCollections.getAll(), {
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    cacheTime: 1000,
    retry: false,
  });
};

export const useQueryGetByStatus = (status: boolean) => {
  return useQuery(['collectionsByStatys'], () => ServiceCollections.getByStatus(status), {
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    cacheTime: 1000,
    retry: false,
  });
};

export const useGetById = (id: string) => {
  return useQuery(['collectionById'], () => ServiceCollections.getById(id), {
    enabled: id !== undefined ? true : false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    cacheTime: 0,
    retry: false,
  });
};

export const useGetCollectionsByStatus = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<ICollectionOutput[]>, any, boolean, unknown> => {
  return useMutation(ServiceCollections.getByStatus, options);
};

export const useGetCollectionsBySearch = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<ICollectionOutput[]>, any, string, unknown> => {
  return useMutation(ServiceCollections.getBySearch, options);
};

export const useCreateCollection = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<null>, any, ICollectionInput, unknown> => {
  return useMutation(ServiceCollections.create, options);
};

export const useUpdateCollection = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<null>, any, IParamsUpdateCollection, unknown> => {
  return useMutation(ServiceCollections.update, options);
};

export const useDeleteCollection = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<null>, any, string, unknown> => {
  return useMutation(ServiceCollections.delete, options);
};
