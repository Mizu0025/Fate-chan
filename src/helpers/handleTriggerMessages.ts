import irc from 'irc';
import { triggerWord } from '../constants/serverOptions';
import { parseImagePrompt } from './parsePrompt';
import { requestImageGeneration } from './requestImageGen';
import { currently_loaded_model } from '../generateImage';
import { getCurrentModels } from './getComfyModels';
import { winstonLogger } from './logger';

const helpTrigger = `${triggerWord} --help`;
const currentModelsTrigger = `${triggerWord} --currentModels`;

function getCurrenModels(client: irc.Client, to: string): void {
  const currentModels = getCurrentModels();

  client.say(to, `${currentModels}`);
}

function explainBotFeatures(client: irc.Client, to: string): void {
  const introduction = "Hello! Here's a list of my current functions:";
  const generateImages = ` - To generate images, use "${triggerWord} prompt". I accept modifiers too!`;
  const generateModifiers = `--width, --height and --no control image dimensions and anything you don't want in the image. --count influences the number I'll make (default 1), and --model lets you swap out what checkpoint model I'm using; that influences artstyle.`;
  const getModels = `If you want a list of current models, use ${currentModelsTrigger}`;

  client.say(to, `${introduction}`);
  client.say(to, `${generateImages}`);
  client.say(to, `${generateModifiers}`);
  client.say(to, `${getModels}`);
}

async function generateImage(client: irc.Client, from: string, to: string, message: string): Promise<void> {
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

export async function handleTriggerMessage(
  client: irc.Client,
  from: string,
  to: string,
  message: string,
) {
  switch (message) {
    case helpTrigger:
      explainBotFeatures(client, to);      
      break;

    case currentModelsTrigger:
      getCurrenModels(client, to);
      break;
  
    default:
      generateImage(client, from, to, message);
      break;
  }
}
