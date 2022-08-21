import { Connect } from 'vite';
import { PLUGIN_NAME } from '../constants';

const formatResMsg = ({ url, method }: Connect.IncomingMessage, ...msg: string[]) =>
  `[${PLUGIN_NAME}] ${msg.join(', ')}, { ${method || ''} ${url || ''} }`;

export default formatResMsg;
