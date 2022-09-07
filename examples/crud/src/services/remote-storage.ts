import type { Item, IStorage } from '../types';
import FetchApi from '../helpers/fetch-api';
import { addTrailingSlash } from '../utils/add-trailing-slash';

class RemoteStorage implements IStorage<Item, number> {
  private readonly url: string;
  private readonly api: FetchApi;

  constructor(url: string) {
    if (!url) {
      throw new Error('url required');
    }
    this.url = addTrailingSlash(url);
    this.api = new FetchApi();
  }

  private formatUrl(id: number) {
    return this.url + id.toString();
  }

  abort() {
    this.api?.abort();
  }

  get aborted() {
    return this.api?.aborted;
  }

  async getOne(id: number) {
    const { json } = await this.api.get(this.formatUrl(id));
    return json;
  }

  async getAll(): Promise<Item[]> {
    const { json } = await this.api.get(this.url);
    if (!Array.isArray(json)) {
      throw new Error('Not Array');
    }
    return json;
  }

  async slice(offset: number, limit: number): Promise<{ items: Item[]; totalCount: number }> {
    const url = `${this.url}?offset=${offset}&limit=${limit}`;
    const headers = {
      totalCount: 'X-Total-Count',
    };
    const { json, totalCount } = await this.api.get(url, {}, headers);
    if (!Array.isArray(json)) {
      throw new Error('Not Array');
    }
    return { items: json, totalCount: parseInt(totalCount) };
  }

  async delete(id: number) {
    const { json } = await this.api.delete(this.formatUrl(id));
    return json;
  }

  async add({ id, ...rest }: Item) {
    const { json } = await this.api.post(this.url, {
      body: JSON.stringify(rest),
    });
    return json;
  }

  async update(item: Item) {
    const { json } = await this.api.put(this.formatUrl(item.id), {
      body: JSON.stringify(item),
    });
    return json;
  }
}

export default RemoteStorage;
