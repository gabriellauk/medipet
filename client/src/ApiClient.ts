const BASE_API_URL = import.meta.env.VITE_REACT_APP_BASE_API_URL;

export default class ApiClient {
  async request(options: any) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== '') {
      query = '?' + query;
    }

    let response;
    try {
      response = await fetch(BASE_API_URL + options.url + query, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
        credentials: 'include'
      });
    }
    catch (error: any) {
      response = {
        ok: false,
        status: 500,
        json: async () => { return {
          code: 500,
          message: 'The server is unresponsive',
          description: error.toString(),
        }; }
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null
    };
  }

  async get(url: string, query?: string, options?: any) {
    return this.request({method: 'GET', url, query, ...options});
  }

  async post(url: string, body?: object | null | undefined, options?: any) {
    return this.request({method: 'POST', url, body, ...options});
  }

  async put(url: string, body?: object | null | undefined, options?: any) {
    return this.request({method: 'PUT', url, body, ...options});
  }

  async delete(url: string, options?: any) {
    return this.request({method: 'DELETE', url, ...options});
  }
}