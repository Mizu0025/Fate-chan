import irc from 'irc';
import { triggerWord } from './constants/serverOptions';
import { parseTriggerMessage } from './helpers/parsePrompt';
import { requestImageGeneration } from './helpers/requestImageGen';

export function registerListeners(client: irc.Client) {
  // Event listener for successful connection
  client.addListener('registered', () => {
    console.log(`Connected to IRC server as ${client.nick}`);
  });

  // Event listener for messages in channels
  client.addListener('message', async (from, to, message) => {
    console.log(`Message from ${from} to ${to}: ${message}`);

    if (message.toLowerCase().includes(triggerWord)) {
      // Respond in the same channel
      const parsedPrompt = parseTriggerMessage(message);
      const imagesUrlPaths = await requestImageGeneration(parsedPrompt);

      imagesUrlPaths.forEach((imageUrlPath: String) => {
        client.say(to, `${imageUrlPath}`);
      });
    }
  });

  // Event listener for joining channels
  client.addListener('join', (channel, nick, message) => {
    console.log(`${nick} joined ${channel}`);
  });
}
