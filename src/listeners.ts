import irc from 'irc';
import { triggerWord } from './helpers/serverOptions';
import { parseTriggerMessage } from './helpers/parsePrompt';

export function registerListeners(client: irc.Client) {
  // Event listener for successful connection
  client.addListener('registered', () => {
    console.log(`Connected to IRC server as ${client.nick}`);
  });

  // Event listener for messages in channels
  client.addListener('message', (from, to, message) => {
    console.log(`Message from ${from} to ${to}: ${message}`);

    if (message.toLowerCase().includes(triggerWord)) {
      // Respond in the same channel
      const parsedPrompt = parseTriggerMessage(message);

      client.say(
        to,
        `Pos: ${parsedPrompt.positive_prompt}, Neg: ${parsedPrompt.negative_prompt}, Width: ${parsedPrompt.width}, Height: ${parsedPrompt.height}, ImgCount: ${parsedPrompt.image_count}`,
      );
    }
  });

  // Event listener for joining channels
  client.addListener('join', (channel, nick, message) => {
    console.log(`${nick} joined ${channel}`);
  });
}
