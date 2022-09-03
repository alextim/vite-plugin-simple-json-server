import type { Item, IStorage } from '../types';

class LocalStorage implements IStorage<Item, number> {
  private readonly name: string;

  constructor(name: string) {
    if (!name) {
      throw new Error('name required');
    }
    this.name = name;
  }

  private getNewId(items: Item[]) {
    return items.reduce((prev, { id }) => (id > prev ? id : prev), 0) + 1;
  }

  private write(items: Item[]) {
    window.localStorage.setItem(this.name, JSON.stringify(items));
  }

  async getOne(id: number) {
    const items = await this.getAll();
    if (!items) {
      return undefined;
    }
    return items.find((el) => el.id === id);
  }

  async getAll(): Promise<Item[]> {
    const data = localStorage.getItem(this.name);
    return data ? JSON.parse(data) : [];
  }

  async delete(id: number) {
    const items = await this.getAll();
    if (!items) {
      return false;
    }
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    items.splice(index, 1);
    this.write(items);
    return true;
  }

  async add({ id, ...rest }: Item) {
    const items = await this.getAll();
    if (!items) {
      return undefined;
    }
    const newId = this.getNewId(items);
    const newItem = { ...rest, id: newId };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  async update(item: Item) {
    const items = await this.getAll();
    if (!items) {
      return false;
    }
    const index = items.findIndex((el) => el.id === item.id);
    if (index === -1) {
      return false;
    }
    items.splice(index, 1, item);
    this.write(items);
    return true;
  }
}

export default LocalStorage;