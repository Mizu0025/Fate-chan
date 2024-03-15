import { triggerWord, defaultPrompt } from './serverOptions';

interface imagePrompt {
  positive_prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  image_count: number;
}

export function parseTriggerMessage(message: string): imagePrompt {
  // Remove the trigger keyword ("!fate") from the start of the message
  const promptInformation = message.replace(triggerWord, '');

  // Define regex patterns to extract information
  const positivePromptRegex = /^(.*?)(?=\s*--|$)/;
  const negativePromptRegex = /--no=(.*?)(?=\s*--|$)/;
  const heightRegex = /--height=(\d+)/;
  const widthRegex = /--width=(\d+)/;
  const countRegex = /--count=(\d+)/;

  // Extract information using regex
  const positivePromptMatch = promptInformation.match(positivePromptRegex);
  const negativePromptMatch = promptInformation.match(negativePromptRegex);
  const heightMatch = promptInformation.match(heightRegex);
  const widthMatch = promptInformation.match(widthRegex);
  const countMatch = promptInformation.match(countRegex);

  // Extracted values
  const positivePrompt = positivePromptMatch ? positivePromptMatch[1].trim() : '';
  const negativePrompt = negativePromptMatch
    ? negativePromptMatch[1].trim()
    : defaultPrompt.negative_prompt;
  const height = heightMatch ? parseInt(heightMatch[1]) : defaultPrompt.height;
  const width = widthMatch ? parseInt(widthMatch[1]) : defaultPrompt.width;
  const count = countMatch ? parseInt(countMatch[1]) : defaultPrompt.image_count;

  return {
    positive_prompt: positivePrompt,
    negative_prompt: negativePrompt,
    height: height,
    width: width,
    image_count: count,
  };
}
