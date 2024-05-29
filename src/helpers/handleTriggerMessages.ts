import irc from 'irc';
import { parseImagePrompt } from './parsePrompt';
import { requestImageGeneration } from './requestImageGen';
import { currently_loaded_model } from '../generateImage';
import { getCurrentModels } from './getComfyModels';
import { winstonLogger } from './logger';
import { changeModelTrigger, currentModelsTrigger, heightTrigger, helpTrigger, imageCountTrigger, negativePromptTrigger, triggerWord, widthTrigger } from '../constants/triggerWords';

function getCurrenModels(client: irc.Client, to: string): void {
  const currentModels = getCurrentModels();

  client.say(to, `${currentModels}`);
}

function explainBotFeatures(client: irc.Client, to: string): void {
  const helpInformation: string[] = [
    "Hello! Here's a list of my current functions:",
    `- To generate images, use "${triggerWord} prompt". I accept modifiers too!`,
    `The ${widthTrigger}, "${heightTrigger}" and "${negativePromptTrigger}" control image dimensions and anything you don't want in the image. "${imageCountTrigger}" influences the number I'll make (default 1), and "${changeModelTrigger}" lets you swap out what checkpoint model I'm using; that influences artstyle.`,
    `If you want a list of current models, use "${currentModelsTrigger}"`
  ];

  for (const key in helpInformation) {
    client.say(to, helpInformation[key]);
  }
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
  if(message === helpTrigger)
    {
      explainBotFeatures(client, to);
    }
  else if(message === currentModelsTrigger)
    {
      getCurrenModels(client, to);
    }
  else if(message.startsWith(triggerWord))
    {
      generateImage(client, from, to, message);
    }
}