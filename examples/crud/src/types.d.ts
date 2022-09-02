export type Item = {
  id: number;
  name: string;
};

export interface IStorage<T, U> {
  getOne(id: U): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  delete(id: U): Promise<boolean>;
  add(item: T): Promise<T | undefined>;
  update(item: T): Promise<boolean>;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
