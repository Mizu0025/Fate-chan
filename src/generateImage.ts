import { comfyUrl } from './constants/imageGeneration';
import { imagePrompt } from './helpers/parsePrompt';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { randomInt } from 'crypto';

interface Prompt {
  [key: string]: {
    inputs: {
      seed?: number;
      width?: number;
      height?: number;
      batch_size?: number;
      text?: string;
    };
  };
}

async function queue_prompt(prompt: Prompt) {
  try {
    const response = await axios.post(comfyUrl, prompt);
    console.log(`statusCode: ${response.status}`);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

export async function generate_txt2img(parsedPrompt: imagePrompt) {
  // load json workflow
  const workflowPath = path.join(__dirname, 'workflows', 'txt2img.json');
  const workflowData = fs.readFileSync(workflowPath, 'utf-8');
  const prompt: Prompt = JSON.parse(workflowData);

  // assign workflow properties
  prompt['3']['inputs']['seed'] = randomInt(0, 1000000);
  prompt['5']['inputs']['width'] = parsedPrompt.width;
  prompt['5']['inputs']['height'] = parsedPrompt.height;
  prompt['5']['inputs']['batch_size'] = parsedPrompt.image_count;
  prompt['6']['inputs']['text'] = parsedPrompt.positive_prompt;
  prompt['7']['inputs']['text'] = parsedPrompt.negative_prompt;

  // post request to comfyUI API
  queue_prompt(prompt);
}
