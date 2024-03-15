import { triggerWord, defaultPrompt } from './serverOptions';

interface imagePrompt {
  positive_prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  image_count: number;
}

export function parseTriggerMessage(message: string): imagePrompt {
  const promptRequest = message.replace(triggerWord, '');

  const parts = promptRequest.split('--').map((part) => part.trim());

  // Initialize fields
  const positivePrompt = parts[0];
  let negativePrompt = defaultPrompt.negative_prompt;
  let width = defaultPrompt.width;
  let height = defaultPrompt.height;
  let imageCount = defaultPrompt.image_count;

  // Parse the remaining parts, which contain the options
  for (const part of parts) {
    if (part.startsWith('no=')) {
      negativePrompt = part.slice(3).trim();
    } else if (part.startsWith('width=')) {
      width = parseInt(part.slice(6).trim(), 10);
    } else if (part.startsWith('height=')) {
      height = parseInt(part.slice(7).trim(), 10);
    } else if (part.startsWith('count=')) {
      imageCount = parseInt(part.slice(6).trim(), 10);
    }
  }

  return {
    positive_prompt: positivePrompt,
    negative_prompt: negativePrompt,
    height: height,
    width: width,
    image_count: imageCount,
  };
}
