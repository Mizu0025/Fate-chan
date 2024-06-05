import fs from 'fs';
import { checkpointConfig, checkpointConfigList } from '../constants/checkpointConfig';

// make new file containing info on each model
// pos/neg prompts, width, height, clip info, cfg info, etc
// make interface for all potential model config, have it as a Partial<interface> in the img gen file
// fetch info from config and export the props which are filled out, as part of the api request

// check comfyui models folder for contents, return contents

export function getCurrentCheckpoints(): Partial<checkpointConfig>[] {
  const checkpointConfigPath = 'checkpointConfig.json'; // Adjust the path as needed
  const checkpointConfig: checkpointConfigList = JSON.parse(
    fs.readFileSync(checkpointConfigPath, 'utf8'),
  );
  let currentCheckpointInformation: Partial<checkpointConfig>[] = [];

  if (!checkpointConfig.models || !Array.isArray(checkpointConfig.models)) {
    throw new Error('Invalid checkpoint configuration format');
  }

  checkpointConfig.models.forEach((model: Partial<checkpointConfig>) => {
    currentCheckpointInformation.push({
      name: model.name,
      description: model.description,
      positivePrompt: model.positivePrompt,
      negativePrompt: model.negativePrompt,
      width: model.width,
      height: model.height,
      cfg_scale: model.cfg_scale,
      guidance: model.guidance,
      steps: model.steps,
      ksampler: model.ksampler,
      clip_skip: model.clip_skip,
    });
  });

  return currentCheckpointInformation;
}

export const doesCheckpointExist = (requestedModelName: string): boolean => {
  return getCurrentCheckpoints().some((model) => model.name === requestedModelName);
};
