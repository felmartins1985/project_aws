import { HttpClient } from 'src/03-model/axios-adapter';
type returnApi = {
  status: boolean;
  error?: any;
  data?: any;
  code?: number;
}
export async function apiBookRequest(httpClient: HttpClient, title: any): Promise<returnApi> {
  try {
    const URL_DEFAULT = process.env.URL_DEFAULT;
    const encodedParams = encodeURIComponent(title);
    const endpoint = `${URL_DEFAULT}?title=${encodedParams}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10 * 60 * 1000);
    const headers = { 'Content-Type': 'application/json' };
    const request = await httpClient.get(endpoint,headers);
    clearTimeout(timeout);
    const data = request.data;
    if (data.numFound === 0) {
      return {
        status: true,
        error: "Livro nao encontrado"
      };
    }
    return {
      status: true,
      data,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        status: false,
        code: 408,
        data: [],
        error: new Error('Request timed out'),
      };
    }
    return {
      status: false,
      code: 400,
      data: [],
      error: error,
    };
  }
}
