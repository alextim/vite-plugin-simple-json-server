import { linkKeys } from './constants';

export type Item = {
  id: number;
  name: string;
};

export interface IStorage<T, U> {
  abort(): void;
  getOne(id: U): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  delete(id: U): Promise<void>;
  add(item: T): Promise<T | undefined>;
  update(item: T): Promise<boolean>;
  slice(begin: number, end: number): Promise<{ items: T[]; totalCount: number }>;
}

export type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

export type Links = ObjectFromList<typeof linkKeys, string>;
