import { comfyUrl } from './constants/imageGeneration';
import { imagePrompt } from './helpers/parsePrompt';
import axios from 'axios';
import fs from 'fs';
import { randomInt } from 'crypto';

interface Prompt_Workflow {
  [key: string]: {
    inputs: {
      seed?: number;
      width?: number;
      height?: number;
      batch_size?: number;
      text?: string;
      filename_prefix?: string,
      ckpt_name?: string;
    };
  };
}

async function queue_prompt(prompt_workflow: Prompt_Workflow) {
    const data = JSON.stringify(prompt_workflow);
    const utf8Data = new TextEncoder().encode(data);

    axios.post(comfyUrl, utf8Data, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': utf8Data.length.toString(),
      },
    }).then(response => {
      console.log("Response:", response.data);
    }).catch(error => {
      console.error("Error:", error);
    })
}

export async function generate_txt2img(parsedPrompt: imagePrompt) {
  // load json workflow
  const workflowData = fs.readFileSync("workflows/txt2img.json", 'utf-8');
  const prompt_workflow: Prompt_Workflow = JSON.parse(workflowData);

  // label nodes
  const ksampler_node = prompt_workflow['3']
  const checkpoint_node = prompt_workflow["4"]
  const empty_latent_node = prompt_workflow["5"]
  const positive_prompt_node = prompt_workflow["6"]
  const negative_prompt_node = prompt_workflow["7"]
  const save_image_node = prompt_workflow["9"]

  // load checkpoint
  checkpoint_node["inputs"]["ckpt_name"] = parsedPrompt.checkpoint;

  // set image dimensions and batch size
  empty_latent_node['inputs']['width'] = parsedPrompt.width;
  empty_latent_node['inputs']['height'] = parsedPrompt.height;
  empty_latent_node['inputs']['batch_size'] = parsedPrompt.image_count;

  // remaining prompt details
  ksampler_node['inputs']['seed'] = randomInt(0, 1000000);
  positive_prompt_node['inputs']['text'] = parsedPrompt.positive_prompt;
  negative_prompt_node['inputs']['text'] = parsedPrompt.negative_prompt;
  save_image_node['inputs']['filename_prefix'] = `fatebot-${randomInt(0, 100)}`;

  // post request to comfyUI API
  queue_prompt(prompt_workflow);
}
