import { defaultPrompt } from '../constants/serverOptions';
import {
  changeModelTrigger,
  heightTrigger,
  imageCountTrigger,
  negativePromptTrigger,
  optionTrigger,
  triggerWord,
  widthTrigger,
} from '../constants/triggerWords';
import { MissingModelError } from '../errors/missingModelError';
import { currently_loaded_model } from '../generateImage';
import { doesCheckpointExist } from './getCurrentCheckpoints';

export interface imagePrompt {
  positive_prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  image_count: number;
  checkpoint: string;
}

function populateDefaultPromptInformation(parts: string[]): imagePrompt {
  const parsedPrompt: imagePrompt = {
    positive_prompt: `${defaultPrompt.positive_prompt}, ${parts[0]}`,
    negative_prompt: defaultPrompt.negative_prompt,
    width: defaultPrompt.width,
    height: defaultPrompt.height,
    image_count: defaultPrompt.image_count,
    checkpoint: currently_loaded_model ? currently_loaded_model : defaultPrompt.checkpoint,
  };

  return parsedPrompt;
}

function populatePromptTriggerInformation(parsedPrompt: imagePrompt, parts: string[]): imagePrompt {
  // Parse the remaining parts, which contain the options
  for (const part of parts) {
    if (part.startsWith(negativePromptTrigger)) {
      parsedPrompt.negative_prompt = `${defaultPrompt.negative_prompt}, ${part.slice(3).trim()}`;
    } else if (part.startsWith(widthTrigger)) {
      parsedPrompt.width = parseInt(part.slice(6).trim(), 10);
    } else if (part.startsWith(heightTrigger)) {
      parsedPrompt.height = parseInt(part.slice(7).trim(), 10);
    } else if (part.startsWith(imageCountTrigger)) {
      parsedPrompt.image_count = parseInt(part.slice(6).trim(), 10);
    } else if (part.startsWith(changeModelTrigger)) {
      const requestedCheckpoint = part.slice(6).trim() + '.safetensors';
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
  const promptRequest = message.replace(triggerWord, '');
  const parts = promptRequest.split(optionTrigger).map((part) => part.trim());
  let parsedPrompt: imagePrompt = populateDefaultPromptInformation(parts);
  parsedPrompt = populatePromptTriggerInformation(parsedPrompt, parts);

  return parsedPrompt;
}
