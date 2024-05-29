import { comfyUrl } from './constants/imageGeneration';
import { imagePrompt } from './helpers/parsePrompt';
import axios from 'axios';
import fs from 'fs';
import { randomInt } from 'crypto';
import { JSONStructure, RequestObject } from './constants/comfyuiRequest';
import { ImageGenerationError } from './errors/imageGenerationError';
import { winstonLogger } from './helpers/logger';

export let currently_loaded_model: string;
const workflowTxt2JsonPath = "workflows/txt2img.json";
const workflowEncodeType = "utf-8";
const imagePrefix = "Fatebot";

async function queue_prompt(prompt_workflow: RequestObject) {
  const prompt: JSONStructure = { prompt: prompt_workflow };
  const data: string = JSON.stringify(prompt);
  winstonLogger.info(`axiosData: ${data}`);

  await axios
    .post(`${comfyUrl}/prompt`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response: any) => {
      winstonLogger.info(JSON.stringify(response.data));
    })
    .catch((error: any) => {
      winstonLogger.error(error);
      throw new ImageGenerationError('Failed to generate image!');
    });
}

function load_workflow(): RequestObject {
  const workflowData = fs.readFileSync(workflowTxt2JsonPath, workflowEncodeType);
  const prompt_workflow: RequestObject = JSON.parse(workflowData);

  return prompt_workflow;
}

function load_checkpoint(parsedPrompt: imagePrompt): void {
  if (!currently_loaded_model || currently_loaded_model !== parsedPrompt.checkpoint) {
    currently_loaded_model = parsedPrompt.checkpoint;
  }
}

function set_prompt_fields(prompt_workflow: RequestObject, parsedPrompt: imagePrompt): void {
  // set checkpoint
  prompt_workflow[4].inputs.ckpt_name = currently_loaded_model;

  // set image dimensions and batch size
  prompt_workflow[5].inputs.width = parsedPrompt.width;
  prompt_workflow[5].inputs.height = parsedPrompt.height;
  prompt_workflow[5].inputs.batch_size = parsedPrompt.image_count;

  // remaining prompt details
  prompt_workflow[3].inputs.seed = randomInt(0, 1000000);
  prompt_workflow[6].inputs.text = parsedPrompt.positive_prompt;
  prompt_workflow[7].inputs.text = parsedPrompt.negative_prompt;
  prompt_workflow[9].inputs.filename_prefix = imagePrefix;
}

export async function generate_txt2img(parsedPrompt: imagePrompt) {
  // load json workflow
  const prompt_workflow = load_workflow();

  // load checkpoint
  load_checkpoint(parsedPrompt);

  // set fields
  set_prompt_fields(prompt_workflow, parsedPrompt);

  // post request to comfyUI API
  await queue_prompt(prompt_workflow);
}
