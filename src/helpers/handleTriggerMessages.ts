import irc from 'irc';
import { parseImagePrompt } from './parsePrompt';
import { requestImageGeneration } from './requestImageGen';
import { currently_loaded_model } from '../generateImage';
import { getCurrentModels, modelInfo } from './getComfyModels';
import { winstonLogger } from './logger';
import { currentModelsTrigger, helpTrigger, optionTrigger, triggerWord } from '../constants/triggerWords';
import { helpInformation } from '../constants/helpInformation';

function getCurrenModels(client: irc.Client, to: string): void {
  const currentModels: modelInfo[] = getCurrentModels();

  currentModels.forEach(model => {
    client.say(to, `${model.name} - ${model.description}`)
  });
}

function explainBotFeatures(client: irc.Client, to: string): void {
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