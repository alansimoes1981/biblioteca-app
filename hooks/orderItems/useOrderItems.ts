import { useMutation, UseMutationResult, useQuery } from 'react-query';
import { ServiceOrderItems } from 'services/orderItems';
import { IOrderItemInput, IOrderItemOutput, IParamsUpdateOrderItem } from 'types/IOrderItems';
import { IMutationOptionsRequest } from 'types/IReactQuery';
import { IResponse } from 'types/IResponse';

export const useGetAllOrderItems = () => {
  return useQuery(['allOrderItems'], () => ServiceOrderItems.getAll(), {
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    cacheTime: 0,
    retry: false,
  });
};

export const useGetOrderItemsBySearch = (
  options?: IMutationOptionsRequest
): UseMutationResult<
  IResponse<IOrderItemOutput[]>,
  any,
  {
    studentName?: string;
    status?: boolean | string;
  },
  unknown
> => {
  return useMutation(ServiceOrderItems.getBySearch, options);
};

export const useCreateOrderItem = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<null>, any, IOrderItemInput, unknown> => {
  return useMutation(ServiceOrderItems.create, options);
};

export const useUpdateStatusOrderItem = (
  options?: IMutationOptionsRequest
): UseMutationResult<IResponse<null>, any, IParamsUpdateOrderItem, unknown> => {
  return useMutation(ServiceOrderItems.updateStatus, options);
};
