import irc from 'irc';
import { triggerWord } from '../constants/serverOptions';
import { parseImagePrompt } from './parsePrompt';
import { requestImageGeneration } from './requestImageGen';

export async function handleTriggerMessage(
  client: irc.Client,
  from: string,
  to: string,
  message: string,
) {
  if (message.toLowerCase().includes(triggerWord)) {
    try {
      const parsedPrompt = parseImagePrompt(message);
      const imagesUrlPaths = await requestImageGeneration(parsedPrompt);

      imagesUrlPaths.forEach((imageUrlPath: String) => {
        client.say(to, `${from}: ${imageUrlPath}`);
      });
    } catch (error) {
      console.log(error);
      client.say(to, `${error}`);
    }
  }
}
