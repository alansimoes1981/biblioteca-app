export interface ICollection {
  id: string;
  title: string;
  ISBN: string;
  publish_year: string;
  language: string;
  publishing_company: string;
  quantity: number;
  cover_image: string;
  status: boolean;
  location: string;
  page_number: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICollectionOutput extends Required<ICollection> {}

export type ICollectionInput = Omit<ICollection, 'id' | 'createdAt' | 'updatedAt'>;

export interface IParamsUpdateCollection {
  id: string;
  body: ICollectionInput;
}
