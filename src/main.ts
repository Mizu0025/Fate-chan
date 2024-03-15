import irc from 'irc';
import { serverOptions } from './helpers/serverOptions';
import { registerListeners } from './listeners';

// Create a new IRC client
const client = new irc.Client(serverOptions.server, serverOptions.userName, serverOptions);
registerListeners(client);
