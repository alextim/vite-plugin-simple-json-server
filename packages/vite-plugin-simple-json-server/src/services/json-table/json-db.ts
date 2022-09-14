import fs from 'node:fs/promises';

interface IJsonDb {
  load: () => Promise<void>;
  isTable: () => boolean;
  updateObject: (data: any, replace?: boolean) => Promise<any>;
}

export class JsonDb implements IJsonDb {
  private readonly pathname: string;
  protected data: any;
  rawContent = '';

  constructor(pathname: string) {
    this.pathname = pathname;
  }

  async load() {
    this.rawContent = await fs.readFile(this.pathname, { encoding: 'utf-8' });
    this.data = JSON.parse(this.rawContent);
  }

  isTable() {
    return Array.isArray(this.data);
  }

  protected async write() {
    await fs.writeFile(this.pathname, JSON.stringify(this.data), { encoding: 'utf-8' });
  }

  async updateObject(data: any, replace = true) {
    if (replace) {
      this.data = data;
    } else {
      this.data = {
        ...this.data,
        ...data,
      };
    }

    await this.write();
    return { ...this.data };
  }
}
