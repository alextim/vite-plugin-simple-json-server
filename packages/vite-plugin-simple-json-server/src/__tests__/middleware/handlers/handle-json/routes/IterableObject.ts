export class IterableObject extends Object {
  private readonly buff: Buffer;

  constructor(data: string) {
    super();
    this.buff = Buffer.from(data);
  }

  [Symbol.asyncIterator]() {
    const value = this.buff;
    let index = -1;
    return {
      async next() {
        index += 1;
        const done = index >= 1;
        return {
          value: done ? Buffer.from('') : value,
          done,
        };
      },
    };
  }
}
