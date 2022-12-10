export default class Http {
  static request(method: string, url: string, data?: any, headers = {}) {
    return fetch(url, {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }

  static get(url: string, data?: any) {
    return Http.request('GET', url, data);
  }

  static post(url: string, data: any) {
    return Http.request('POST', url, data);
  }

  static put(url: string, data: any) {
    return Http.request('PUT', url, data);
  }

  static delete(url: string) {
    return Http.request('DELETE', url);
  }
}