import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:3000/api/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
});

const _get = async(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return await apiClient.get(url, config)
}

const _delete = async (url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return await apiClient.delete(url, config);
};

const _put = async (url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return await apiClient.put(url, data, config);
};

const _post = async (url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return await apiClient.post(url, data, config);
};

export { _delete, _get, _post, _put };