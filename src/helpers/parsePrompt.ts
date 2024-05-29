import { defaultPrompt } from '../constants/serverOptions';
import { changeModelTrigger, heightTrigger, imageCountTrigger, negativePromptTrigger, triggerWord, widthTrigger } from '../constants/triggerWords';
import { MissingModelError } from '../errors/missingModelError';
import { currently_loaded_model } from '../generateImage';
import { doesModelExist } from './getComfyModels';

export interface imagePrompt {
  positive_prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  image_count: number;
  checkpoint: string;
}

const triggerKeyList = [
  negativePromptTrigger,
  widthTrigger,
  heightTrigger,
  imageCountTrigger,
  changeModelTrigger
];

function assignValue(result: Partial<imagePrompt>, triggerKey: string, value: string | number): void {
  const stringValue: string = value as string;
  const numValue: number = value as number;
  const isNumber: boolean = typeof value === 'number';
  const isCustomNegativePrompt: boolean = !(stringValue === defaultPrompt.negative_prompt);

  switch (triggerKey) {
    case negativePromptTrigger:
      result.negative_prompt = isCustomNegativePrompt ? `${defaultPrompt.negative_prompt}, ${stringValue}` : stringValue;
      break;
    case widthTrigger:
      result.width = isNumber ? numValue : parseInt(stringValue);
      break;
    case heightTrigger:
      result.height = isNumber ? numValue : parseInt(stringValue);
      break;
    case imageCountTrigger:
      result.image_count = isNumber ? numValue : parseInt(stringValue);
      break;
    case changeModelTrigger:
      result.checkpoint = doesModelExist(stringValue + '.safetensors') ? stringValue : '';
      break;
    default:
      break;
  }
}

function stripPromptTriggers(message: string): string {  
    // Replace trigger keys with an empty string
    const strippedMessage = message.split('--').map((part) => part.trim())[0];
  
    return strippedMessage; // Remove leading/trailing spaces
}  

export function parseImagePrompt(message: string): imagePrompt {
  const promptRequest = message.replace(triggerWord, '');
  const defaultPromptsList = [
    defaultPrompt.negative_prompt,
    defaultPrompt.width,
    defaultPrompt.height,
    defaultPrompt.image_count,
    currently_loaded_model ? currently_loaded_model : defaultPrompt.checkpoint
  ]

  const result: Partial<imagePrompt> = {
    positive_prompt: `${defaultPrompt.positive_prompt}, ${stripPromptTriggers(promptRequest)}`,
  };

  for (const triggerKey of triggerKeyList) {
    const index = triggerKeyList.indexOf(triggerKey) + 1;
    const nextTriggerKey = triggerKeyList[index] || '';
    const regex = new RegExp(`${triggerKey}=(.*?)(?=${nextTriggerKey}|$)`, 'g');
    const matches = promptRequest.match(regex);

    if (matches) {
      const matchedValue = matches[0].replace(triggerKey + '=', '');
      assignValue(result, triggerKey, matchedValue);
    } else {
      const index = triggerKeyList.indexOf(triggerKey);
      if(index !== -1) {
        assignValue(result, triggerKey, defaultPromptsList[index])
      }
    }
  }

  // Check if all required properties are assigned
  if(result.checkpoint === null || result.checkpoint === '') {
    throw new MissingModelError('No existing model in database!');
  }

  return result as imagePrompt;
}

// export function parseImagePrompt(message: string): imagePrompt {

  // const promptRequest = message.replace(triggerWord, '');

  // const parts = promptRequest.split('--').map((part) => part.trim());

  // Initialize fields
  // const positivePrompt = `${defaultPrompt.positive_prompt}, ${parts[0]}`;
  // let negativePrompt = defaultPrompt.negative_prompt;
  // let width = defaultPrompt.width;
  // let height = defaultPrompt.height;
  // let imageCount = defaultPrompt.image_count;
  // let checkpoint = currently_loaded_model 
  // ? currently_loaded_model 
  // : defaultPrompt.checkpoint;

  // Parse the remaining parts, which contain the options
  // for (const part of parts) {
  //   if (part.startsWith('no=')) {
  //     negativePrompt = `${defaultPrompt.negative_prompt}, ${part.slice(3).trim()}`;
  //   } else if (part.startsWith('width=')) {
  //     width = parseInt(part.slice(6).trim(), 10);
  //   } else if (part.startsWith('height=')) {
  //     height = parseInt(part.slice(7).trim(), 10);
  //   } else if (part.startsWith('count=')) {
  //     imageCount = parseInt(part.slice(6).trim(), 10);
  //   } else if (part.startsWith('model=')) {
  //     const requestedCheckpoint = part.slice(6).trim() + '.safetensors';

  //     const existingModel = doesModelExist(requestedCheckpoint);
  //     if (existingModel) {
  //       checkpoint = requestedCheckpoint;
  //     } else {
  //       throw new MissingModelError('No existing model in database!');
  //     }
  //   }
  // }

  // return {
  //   positive_prompt: positivePrompt,
  //   negative_prompt: negativePrompt,
  //   height: height,
  //   width: width,
  //   image_count: imageCount,
  //   checkpoint: checkpoint,
  // };
// }
