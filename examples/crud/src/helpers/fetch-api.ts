export class FetchError extends Error {
  readonly code: number;
  readonly message: string;

  constructor(message: string, code = 0) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

const defaultMethod = 'GET';
const defaultHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
};

class FetchApi {
  private abortController: AbortController | undefined;

  abort() {
    this.abortController?.abort();
  }

  get aborted() {
    return this.abortController?.signal.aborted;
  }

  private async fetchApi(url: string, opts: RequestInit = {}, headers: Record<string, string> = {}) {
    this.abortController = new AbortController();

    const resp = await fetch(url, {
      method: defaultMethod,
      headers: defaultHeaders,
      ...opts,
      signal: this.abortController.signal,
    });

    if (!resp.ok) {
      const json = await resp.json();
      throw new FetchError(json.message, resp.status);
    }

    if (resp.status === 204) {
      return {};
    }

    const json = await resp.json();
    const result: Record<string, any> = {
      json,
    };

    Object.entries(headers).forEach(([varKey, headerKey]) => {
      const val = resp.headers.get(headerKey);
      if (val !== undefined && val !== '') {
        result[varKey] = val;
      }
    });
    return result;
  }

  async get(url: string, opts: RequestInit = {}, headers: Record<string, string> = {}) {
    opts.method = 'GET';
    return await this.fetchApi(url, opts, headers);
  }

  async post(url: string, opts: RequestInit = {}) {
    opts.method = 'POST';
    return await this.fetchApi(url, opts);
  }

  async put(url: string, opts: RequestInit = {}) {
    opts.method = 'PUT';
    return await this.fetchApi(url, opts);
  }

  async delete(url: string, opts: RequestInit = {}) {
    opts.method = 'DELETE';
    await this.fetchApi(url, opts);
  }
}

export default FetchApi;
