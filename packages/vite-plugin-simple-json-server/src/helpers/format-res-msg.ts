import { PLUGIN_NAME } from '../constants';

const formatResMsg = (msg: string, url: string | undefined, method: string | undefined) =>
  `[${PLUGIN_NAME}] ${msg} , { url: "${url || ''}", method: "${method || ''}" }`;

export default formatResMsg;
