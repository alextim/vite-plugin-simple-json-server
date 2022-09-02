import { Connect } from 'vite';

export class BodyParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BodyParseError';
    // Set the prototype explicitly.
    // Object.setPrototypeOf(this, BodyParseError.prototype);
  }
}

const PAYLOAD_LIMIT = 1e6;

export const parseBody = async (req: Connect.IncomingMessage) => {
  /*
  let body = '';
  while (true) {
    const chunk = req.read();
    if (chunk === null) {
      break;
    }
    body += chunk;
    if (body.length > 1e6) {
      // req.destroy(new BodyParseError('Body exceeds 1e6'));
      throw new BodyParseError('Request body exceeds 1e6');
    }
  }
  */

  const buffers = [];
  let n = 0;
  for await (const chunk of req) {
    if (chunk?.length) {
      n += chunk.length;
    }
    if (n > PAYLOAD_LIMIT) {
      throw new BodyParseError('Request body exceeds 1e6');
    }
    buffers.push(chunk);
  }

  const body = Buffer.concat(buffers).toString();

  if (!body) {
    throw new BodyParseError('Empty body');
  }

  try {
    return JSON.parse(body);
  } catch (err) {
    throw new BodyParseError('Not valid json in body');
  }
};
