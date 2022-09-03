import type { Item, IStorage } from '../types';

const addTrailingSlash = (s: string) => (s.endsWith('/') ? s : `${s}/`);

export class FetchError extends Error {
  readonly code: number;
  readonly message: string;

  constructor(message: string, code = 0) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

class RemoteStorage implements IStorage<Item, number> {
  private readonly apiUrl: string;
  private abortController: AbortController | undefined;

  constructor(apiUrl: string) {
    if (!apiUrl) {
      throw new Error('apiUrl required');
    }
    this.apiUrl = addTrailingSlash(apiUrl);
  }

  abort() {
    this.abortController?.abort();
  }

  get aborted() {
    return this.abortController?.signal.aborted;
  }

  private async fetchApi(params: string, init?: RequestInit) {
    this.abortController = new AbortController();
    const resp = await fetch(`${this.apiUrl}${params}`, {
      ...init,
      signal: this.abortController.signal,
    });
    if (!resp.ok) {
      const json = await resp.json();
      throw new FetchError(json.message, resp.status);
    }
    if (resp.status === 204) {
      return true;
    }
    const json = await resp.json();
    return json;
  }

  async getOne(id: number) {
    const item = await this.fetchApi(id.toString());
    return item;
  }

  async getAll(): Promise<Item[]> {
    const items = await this.fetchApi('');
    if (!Array.isArray(items)) {
      throw new Error('Not Array');
    }
    return items;
  }

  async delete(id: number) {
    const result = await this.fetchApi(id.toString(), { method: 'DELETE' });
    return result;
  }

  async add({ id, ...rest }: Item) {
    const result = await this.fetchApi('', {
      method: 'POST',
      body: JSON.stringify(rest),
      headers: {
        'content-type': 'application/json',
      },
    });
    return result;
  }

  async update(item: Item) {
    const result = await this.fetchApi(item.id.toString(), {
      method: 'PUT',
      body: JSON.stringify(item),
      headers: {
        'content-type': 'application/json',
      },
    });
    return result;
  }
}

export default RemoteStorage;
