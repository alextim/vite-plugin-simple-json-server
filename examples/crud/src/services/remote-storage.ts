import type { Item, IStorage } from '../types';
import FetchApi from '../helpers/fetch-api';

const addTrailingSlash = (s: string) => (s.endsWith('/') ? s : `${s}/`);

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
    this.api.abort();
  }

  get aborted() {
    return this.api.aborted;
  }

  async getOne(id: number) {
    return await this.api.get(this.formatUrl(id));
  }

  async getAll(): Promise<Item[]> {
    const items = await this.api.get(this.url);
    if (!Array.isArray(items)) {
      throw new Error('Not Array');
    }
    return items;
  }

  async delete(id: number) {
    return await this.api.delete(this.formatUrl(id));
  }

  async add({ id, ...rest }: Item) {
    return await this.api.post(this.url, {
      body: JSON.stringify(rest),
    });
  }

  async update(item: Item) {
    return await this.api.put(this.formatUrl(item.id), {
      body: JSON.stringify(item),
    });
  }
}

export default RemoteStorage;
