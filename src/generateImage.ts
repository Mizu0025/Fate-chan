import { comfyUrl } from './constants/imageGeneration';
import { imagePrompt } from './helpers/parsePrompt';
import axios from 'axios';
import fs from 'fs';
import { randomInt } from 'crypto';
import { JSONStructure, RequestObject } from './constants/comfyuiRequest';

async function queue_prompt(prompt_workflow: RequestObject) {
  const prompt: JSONStructure = { prompt: prompt_workflow };
  const data: string = JSON.stringify(prompt);

  await axios
    .post(`${comfyUrl}/prompt`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log('Response:', response.data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export async function generate_txt2img(parsedPrompt: imagePrompt) {
  // load json workflow
  const workflowData = fs.readFileSync('workflows/txt2img.json', 'utf-8');
  const prompt_workflow: RequestObject = JSON.parse(workflowData);

  // load checkpoint
  prompt_workflow[4].inputs.ckpt_name = parsedPrompt.checkpoint;

  // set image dimensions and batch size
  prompt_workflow[5].inputs.width = parsedPrompt.width;
  prompt_workflow[5].inputs.height = parsedPrompt.height;
  prompt_workflow[5].inputs.batch_size = parsedPrompt.image_count;

  // remaining prompt details
  prompt_workflow[3].inputs.seed = randomInt(0, 1000000);
  prompt_workflow[6].inputs.text = parsedPrompt.positive_prompt;
  prompt_workflow[7].inputs.text = parsedPrompt.negative_prompt;
  prompt_workflow[9].inputs.filename_prefix = 'Fatebot';

  // post request to comfyUI API
  await queue_prompt(prompt_workflow);
}
