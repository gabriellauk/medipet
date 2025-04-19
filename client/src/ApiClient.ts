import { GenericApiResponse } from './types/CommonTypes';

const BASE_API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

export default class ApiClient {
  async request(options: any): Promise<GenericApiResponse> {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== '') {
      query = '?' + query;
    }

    try {
      const response = await fetch(BASE_API_URL + options.url + query, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
        credentials: 'include',
      });

      const bodyText = await response.text();
      const jsonBody = bodyText ? JSON.parse(bodyText) : null;

      return {
        ok: response.ok,
        status: response.status,
        body: jsonBody,
      };
    } catch (error: any) {
      return {
        ok: false,
        status: 500,
        body: {
          code: 500,
          message: 'The server is unresponsive',
          description: error.toString(),
        },
      };
    }
  }

  async get(url: string, query?: string, options?: any) {
    return this.request({ method: 'GET', url, query, ...options });
  }

  async post(url: string, body?: object | null | undefined, options?: any) {
    return this.request({ method: 'POST', url, body, ...options });
  }

  async put(url: string, body?: object | null | undefined, options?: any) {
    return this.request({ method: 'PUT', url, body, ...options });
  }

  async patch(url: string, body?: object | null | undefined, options?: any) {
    return this.request({ method: 'PATCH', url, body, ...options });
  }

  async delete(url: string, options?: any) {
    return this.request({ method: 'DELETE', url, ...options });
  }
}
