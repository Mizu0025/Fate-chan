import irc from 'irc';
import { handleTriggerMessage } from './helpers/handleTriggerMessages';

export function registerListeners(client: irc.Client) {
  // Event listener for successful connection
  client.addListener('registered', () => {
    console.log(`Connected to IRC server as ${client.nick}`);
  });

  // Event listener for messages in channels
  client.addListener('message', async (from: string, to: string, message: string) => {
    console.log(`Message from ${from} to ${to}: ${message}`);

    await handleTriggerMessage(client, from, to, message);
  });

  // Event listener for joining channels
  client.addListener('join', (channel: string, nick: string, message: string) => {
    console.log(`${nick} joined ${channel}`);
  });
}
