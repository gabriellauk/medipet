import { GenericApiResponse } from './types/GenericTypes';

const BASE_API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

type RequestOptions = {
  query?: Record<string, string>;
  headers?: Record<string, string>;
};

export default class ApiClient {
  private buildQueryString(query?: Record<string, string>): string {
    if (!query) return '';
    const queryString = new URLSearchParams(query).toString();
    return queryString ? `?${queryString}` : '';
  }

  private getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async fetchWithTimeout(
    resource: string,
    options: RequestInit,
    timeout = 5000
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  }

  async request<T>(
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      url: string;
      body?: object;
    } & RequestOptions
  ): Promise<GenericApiResponse<T>> {
    const query = this.buildQueryString(options.query);

    try {
      const response = await this.fetchWithTimeout(
        BASE_API_URL + options.url + query,
        {
          method: options.method,
          headers: {
            ...this.getDefaultHeaders(),
            ...options.headers,
          },
          body: options.body ? JSON.stringify(options.body) : null,
          credentials: 'include',
        }
      );

      const bodyText = await response.text();
      const jsonBody = bodyText ? JSON.parse(bodyText) : null;

      return {
        ok: response.ok,
        status: response.status,
        body: jsonBody as T,
      };
    } catch (error: unknown) {
      console.error('API Request Error:', error);

      const isErrorWithMessage = error instanceof Object && 'error' in error;

      return {
        ok: false,
        status: 500,
        body: {
          code: 500,
          message: 'The server is unresponsive',
          description: isErrorWithMessage
            ? error.error
            : 'Unknown error occurred',
        } as T,
      };
    }
  }

  async get<T>(
    url: string,
    options?: RequestOptions
  ): Promise<GenericApiResponse<T>> {
    return this.request({ ...options, method: 'GET', url });
  }

  async post<TBody, TResult>(
    url: string,
    body?: TBody,
    options?: RequestOptions
  ): Promise<GenericApiResponse<TResult>> {
    if (body) {
      return this.request({
        ...options,
        method: 'POST',
        url,
        body: body as object,
      });
    }

    return this.request({ ...options, method: 'POST', url });
  }

  async put<TBody, TResult>(
    url: string,
    body: TBody,
    options?: RequestOptions
  ): Promise<GenericApiResponse<TResult>> {
    return this.request({
      ...options,
      method: 'PUT',
      url,
      body: body as object,
    });
  }

  async patch<TBody, TResult>(
    url: string,
    body: TBody,
    options?: RequestOptions
  ): Promise<GenericApiResponse<TResult>> {
    return this.request({
      ...options,
      method: 'PATCH',
      url,
      body: body as object,
    });
  }

  async delete<T>(
    url: string,
    options?: RequestOptions
  ): Promise<GenericApiResponse<T>> {
    return this.request({ ...options, method: 'DELETE', url });
  }
}
