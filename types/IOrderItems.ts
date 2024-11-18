export interface IOrderItem {
  id: string;
  collection_id: string;
  student_id: string;
  status: boolean;
  devolution_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IOrderItemInput = Omit<IOrderItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface IOrderItemOutput {
  id: string;
  devolution_date: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  collection: {
    id: string;
    title: string;
  };
  student: {
    id: string;
    name: string;
    class: string;
  };
}

export interface IParamsUpdateOrderItem {
  id: string;
  body: Partial<IOrderItemInput>;
}
