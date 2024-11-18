export interface IStudent {
  id: string;
  name: string;
  school: string;
  class: string;
  email: string;
  brithday_date: Date;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IStudentInput = Omit<IStudent, 'id' | 'createdAt' | 'updatedAt'>;

export type IStudentInputUpdate = Omit<IStudent, 'createdAt' | 'updatedAt' | 'email' | 'id'>;

export interface IStudentOutput extends Required<IStudent> {}

export interface IParamsUpdateStudent {
  id: string;
  body: Partial<IStudentInput>;
}
