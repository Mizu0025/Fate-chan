import irc from 'irc';
import { parseImagePrompt } from './parsePrompt';
import { requestImageGeneration } from './requestImageGen';
import { currently_loaded_model } from '../generateImage';
import { getCurrentCheckpoints } from './getCurrentCheckpoints';
import { winstonLogger } from './logger';
import { currentCheckpointsTrigger, helpTrigger, triggerWord } from '../constants/triggerWords';
import { helpInformation } from '../constants/helpInformation';
import { checkpointConfig } from '../constants/checkpointConfig';

function getCurrenModels(client: irc.Client, to: string): void {
  const currentModels: checkpointConfig[] = getCurrentCheckpoints();

  currentModels.forEach((model) => {
    client.say(to, `${model.name} - ${model.description}`);
  });
}

function explainBotFeatures(client: irc.Client, to: string): void {
  for (const key in helpInformation) {
    client.say(to, helpInformation[key]);
  }
}

async function generateImage(
  client: irc.Client,
  from: string,
  to: string,
  message: string,
): Promise<void> {
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
  if (message === helpTrigger) {
    explainBotFeatures(client, to);
  } else if (message === currentCheckpointsTrigger) {
    getCurrenModels(client, to);
  } else if (message.startsWith(triggerWord)) {
    generateImage(client, from, to, message);
  }
}
