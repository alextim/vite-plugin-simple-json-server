import { sort } from '../../utils/comp-properties-of';
import { searchProp } from '../../utils/search-prop';
import { JsonDb } from './json-db';

export class JsonTable extends JsonDb {
  private getIndexById(id: number) {
    return (this.data as any[]).findIndex((item: any) => item.id == id);
  }

  private exists(id: number) {
    return this.getIndexById(id) !== -1;
  }

  count(q?: Record<string, any>): number {
    if (this.data.length === 0 || !q) {
      return this.data.length;
    }
    const props = Object.keys(q);
    if (props.length === 0) {
      return this.data.length;
    }
    return this.data.reduce((prev: number, curr: any) => (searchProp(curr, q, props) ? prev + 1 : prev), 0);
  }

  filter(q: Record<string, any> | undefined) {
    if (!q || this.data.length === 0) {
      return;
    }
    const props = Object.keys(q);
    if (!props.length) {
      return;
    }
    this.data = (this.data as any[]).filter((item) => searchProp(item, q, props));
  }

  sort(params: string[]) {
    if (params.length === 0) {
      return;
    }
    sort(this.data, ...params);
  }

  getById(id: number) {
    return (this.data as any[]).find((item: any) => item.id == id);
  }

  slice(offset: number, limit: number) {
    this.data = this.data.slice(offset, offset + limit);
  }

  serialize(spaces = 0) {
    return JSON.stringify(this.data, null, spaces);
  }

  async delete(id: number) {
    const index = this.getIndexById(id);
    if (index === -1) {
      return false;
    }

    this.data.splice(index, 1);

    await this.write();
    return true;
  }

  async update(id: number, item: any, replace = true) {
    const index = this.getIndexById(id);
    if (index === -1) {
      return false;
    }

    item.id = id;

    if (replace) {
      this.data.splice(index, 1, item);
    } else {
      this.data[index] = {
        ...this.data[index],
        ...item,
      };
    }

    await this.write();
    return true;
  }

  async push(item: any) {
    if (item.hasOwnProperty('id')) {
      if (this.exists(item.id)) {
        return false;
      }
    } else {
      item.id = this.getNextId();
    }

    this.data.push(item);

    await this.write();
    return true;
  }

  private getNextId(): number {
    return (
      (this.data as any[]).reduce((prev, curr) => {
        const n: number = curr.id !== undefined ? parseInt(curr.id) : 0;
        return Math.max(prev, n);
      }, 0) + 1
    );
  }
}
