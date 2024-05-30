import fs from 'fs';

// make new file containing info on each model
// pos/neg prompts, width, height, clip info, cfg info, etc
// make interface for all potential model config, have it as a Partial<interface> in the img gen file
// fetch info from config and export the props which are filled out, as part of the api request

// check comfyui models folder for contents, return contents

interface checkpointConfig {
  name: string,
  description: string,
  positivePrompt: string,
  negativePrompt: string,
  width: number,
  height: number,
  cfg_scale: number,
  guidance: number,
  steps: number,
  ksampler: string,
  clip_skip: number
};

interface checkpointConfigList {
  models: checkpointConfig[]
}

export interface modelInfo {
  name: string,
  description: string
}

export function getCurrentModels(): modelInfo[] {
  const checkpointConfigPath = 'checkpointConfig.json'; // Adjust the path as needed
  const checkpointConfig: checkpointConfigList = JSON.parse(fs.readFileSync(checkpointConfigPath, 'utf8'));
  let currentModelInfo: modelInfo[] = [];

  if (!checkpointConfig.models || !Array.isArray(checkpointConfig.models)) {
    throw new Error('Invalid checkpoint configuration format');
  }

  checkpointConfig.models.forEach((model: checkpointConfig) => {
    currentModelInfo.push({
      name: model.name,
      description: model.description
    });
  })

  return currentModelInfo;
}

export const doesModelExist = (requestedModelName: string): boolean => {
  const modelsInfo = getCurrentModels();
  return modelsInfo.some(model => model.name === requestedModelName);
};
