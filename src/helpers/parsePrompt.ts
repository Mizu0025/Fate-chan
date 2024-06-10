import { checkpointConfig } from '../constants/checkpointConfig';
import {
  changeCheckpointTrigger,
  heightTrigger,
  imageCountTrigger,
  negativePromptTrigger,
  optionTrigger,
  triggerWord,
  widthTrigger,
} from '../constants/triggerWords';
import { MissingModelError } from '../errors/missingModelError';
import { currently_loaded_model } from '../generateImage';
import { doesCheckpointExist } from './doesCheckpointExist';
import { getCurrentCheckpoints } from './getCurrentCheckpoints';

export interface imagePrompt {
  positive_prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  image_count: number;
  checkpoint: string;
}

function populateDefaultPromptInformation(
  parts: string[],
  defaultPrompt: checkpointConfig,
): imagePrompt {
  const defaultImageCount = 1;

  const parsedPrompt: imagePrompt = {
    positive_prompt: defaultPrompt.positivePrompt
      ? `${defaultPrompt.positivePrompt}, ${parts[0]}`
      : parts[0],
    negative_prompt: defaultPrompt.negativePrompt
      ? `${defaultPrompt.negativePrompt}, ${parts[0]}`
      : parts[0],
    width: defaultPrompt.width,
    height: defaultPrompt.height,
    image_count: defaultImageCount,
    checkpoint: currently_loaded_model ? currently_loaded_model : defaultPrompt.name,
  };

  return parsedPrompt;
}

function populatePromptTriggerInformation(
  parsedPrompt: imagePrompt,
  parts: string[],
  defaultPrompt: checkpointConfig,
): imagePrompt {
  for (const part of parts) {
    if (part.startsWith(negativePromptTrigger)) {
      parsedPrompt.negative_prompt = `${defaultPrompt.negativePrompt}, ${part.slice(3).trim()}`;
    } else if (part.startsWith(widthTrigger)) {
      parsedPrompt.width = parseInt(part.slice(6).trim(), 10);
    } else if (part.startsWith(heightTrigger)) {
      parsedPrompt.height = parseInt(part.slice(7).trim(), 10);
    } else if (part.startsWith(imageCountTrigger)) {
      parsedPrompt.image_count = parseInt(part.slice(6).trim(), 10);
    } else if (part.startsWith(changeCheckpointTrigger)) {
      const requestedCheckpoint = part.slice(6).trim();
      const existingModel = doesCheckpointExist(requestedCheckpoint);
      if (existingModel) {
        parsedPrompt.checkpoint = requestedCheckpoint;
      } else {
        throw new MissingModelError('No existing model in database!');
      }
    }
  }

  return parsedPrompt;
}

export function parseImagePrompt(message: string): imagePrompt {
  const defaultPrompt = getCurrentCheckpoints()[0];
  const promptRequest = message.replace(triggerWord, '');
  const parts = promptRequest.split(optionTrigger).map((part) => part.trim());
  let parsedPrompt: imagePrompt = populateDefaultPromptInformation(parts, defaultPrompt);
  parsedPrompt = populatePromptTriggerInformation(parsedPrompt, parts, defaultPrompt);

  return parsedPrompt;
}
