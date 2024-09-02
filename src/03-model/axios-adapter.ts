import axios, { AxiosResponse } from 'axios';

const defaultHeaders = {
  'Content-Type': 'application/json',
};
export interface HttpClient {
  get(url: string, headers: any): Promise<AxiosResponse>;
}

export class AxiosAdapter implements HttpClient {
  async get(url: string, headers = defaultHeaders): Promise<AxiosResponse> {
    return axios.get(url, { headers });
  }
}
