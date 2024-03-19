import irc from 'irc';
import { handleTriggerMessage } from './helpers/handleTriggerMessages';
import { winstonLogger } from './helpers/logger';

export function registerListeners(client: irc.Client) {
  // Event listener for successful connection
  client.addListener('registered', () => {
    winstonLogger.info(`Connected to IRC server as ${client.nick}`);
  });

  // Event listener for messages in channels
  client.addListener('message', async (from: string, to: string, message: string) => {
    winstonLogger.info(`Message from ${from} to ${to}: ${message}`);

    await handleTriggerMessage(client, from, to, message);
  });

  // Event listener for joining channels
  client.addListener('join', (channel: string, nick: string, message: string) => {
    winstonLogger.info(`${nick} joined ${channel}`);
  });
}
