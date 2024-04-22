import irc from 'irc';
import { triggerWord } from '../constants/serverOptions';
import { parseImagePrompt } from './parsePrompt';
import { requestImageGeneration, requestSD3ImageGeneration } from './requestImageGen';
import { currently_loaded_model } from '../generateImage';
import { getCurrentModels } from './getComfyModels';
import { winstonLogger } from './logger';
import { getSingleUrlPath } from './getUrlPath';

function getCurrenModels(client: irc.Client, to: string) {
  const currentModels = getCurrentModels();

  client.say(to, `${currentModels}`);
}

function explainBotFeatures(client: irc.Client, to: string) {
  const introduction = "Hello! Here's a list of my current functions:";
  const generateImages = ` - To generate images, use "${triggerWord} prompt". I accept modifiers too!`;
  const generateModifiers = `--width, --height and --no control image dimensions and anything you don't want in the image. --count influences the number I'll make (default 1), and --model lets you swap out what checkpoint model I'm using; that influences artstyle.`;
  const getModels = `If you want a list of current models, use "${triggerWord} --currentModels"`;

  client.say(to, `${introduction}`);
  client.say(to, `${generateImages}`);
  client.say(to, `${generateModifiers}`);
  client.say(to, `${getModels}`);
}

export async function handleTriggerMessage(
  client: irc.Client,
  from: string,
  to: string,
  message: string,
) {
  const lowercaseMsg = message.toLowerCase();

  if (lowercaseMsg === `${triggerWord} --help`) {
    explainBotFeatures(client, to);
  } else if (lowercaseMsg === `${triggerWord} --currentModels`) {
    getCurrenModels(client, to);
  } else if (lowercaseMsg.startsWith('!sd3')) {
    try {
      const parsedPrompt = parseImagePrompt(message);
      const imageFilepath = await requestSD3ImageGeneration(parsedPrompt);
      const imageUrlPath = getSingleUrlPath(imageFilepath);

      client.say(to, `${from}: ${imageUrlPath}`);
    } catch (error: any) {
      winstonLogger.error(error);
      client.say(to, `${error}`);
    }
  } else {
    try {
      const parsedPrompt = parseImagePrompt(message);
      if (parsedPrompt.checkpoint != currently_loaded_model) {
        winstonLogger.info(`Model swapped to ${parsedPrompt.checkpoint}`);
        client.say(to, `The model is now ${parsedPrompt.checkpoint}`);
      }

      const imagesUrlPaths = await requestImageGeneration(parsedPrompt);

      imagesUrlPaths.forEach((imageUrlPath: String) => {
        client.say(to, `${from}: ${imageUrlPath}`);
      });
    } catch (error: any) {
      winstonLogger.error(error);
      client.say(to, `${error}`);
    }
  }
}
