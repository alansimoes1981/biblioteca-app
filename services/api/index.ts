import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

const client = axios.create({
  baseURL: 'https://api-freela-biblioteca.onrender.com',
  // http://10.0.2.2:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 30000,
});

const getToken = async () => {
  const usersToken: any = await AsyncStorage.getItem('accessToken');

  if (!usersToken) {
    return '';
  }
  return JSON.parse(usersToken);
};

client.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('errorAPI:', error);

    if (error.response.status === 401) {
      // Redirecionar ou deslogar o usuário
    } else if (error.response.status === 403) {
      // Acesso negado
    } else if (error.response.status === 400) {
      // Requisição inválida
    } else if (error.response.status === 404 && !error.config.skipNotFound) {
      console.log('Recurso não encontrado');
    } else if (error.code === 'ERR_NETWORK') {
      console.warn('Verifique sua internet e tente novamente mais tarde.');
    } else if (error.response.status >= 500) {
      console.log('Desculpe, ocorreu um erro inesperado. Tente novamente mais tarde.');
    }

    return Promise.reject(error);
  }
);

export const get = (url: string, headers = {}): Promise<any> => client.get(url, headers);
export const post = (url: string, data: any, headers = {}): Promise<any> =>
  client.post(url, data, headers);
export const put = (url: string, data: any, headers = {}): Promise<any> =>
  client.put(url, data, headers);
export const remove = (url: string): Promise<any> => client.delete(url);

const httpService = {
  get,
  post,
  put,
  remove,
};

export default httpService;
