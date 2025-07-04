import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const A_BASE_URL = "https://andrea-dev.althena.ai/api/";

const althena_apiClient = axios.create({
    baseURL: A_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'f0d1bca6-53ce-4966-a4f4-9c7624e42b26'
    }
})

const althena_get = async (url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    return althena_apiClient.get(url, config)
}

const althena_post = async (url: string,data = {}, config: AxiosRequestConfig={}): Promise<AxiosResponse> => {
    return althena_apiClient.post(url, data, config);
}

const althena_put = async (url: string,data={}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    return althena_apiClient.put(url, data, config);
}

export { althena_get, althena_post, althena_put }