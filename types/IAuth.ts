export interface IBodyLogin {
  email: string;
  password: string;
}

export interface IResponseLogin {
  accessToken: string;
}

export interface IBodyRegister {
  name: string;
  school: string;
  email: string;
  telephone: string;
  password: string;
}

export interface IUser {
  id: string;
  name: string;
  school: string;
  email: string;
  telephone: string;
  password_hash: string;
  createdAt: Date;
  updatedAt: Date;
}
