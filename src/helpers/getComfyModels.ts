import fs from 'fs';
import { comfyCheckpointsDir } from '../constants/imageGeneration';

// check comfyui models folder for contents, return contents
export function getCurrentModels(): string[] {
  const folderContents: string[] = fs.readdirSync(comfyCheckpointsDir);
  let currentModels: string[] = [];

  folderContents.forEach((file) => {
    if (file.includes('.safetensors')) {
      currentModels.push(file);
    }
  });

  return currentModels;
}

export function doesModelExist(model: string): boolean {
  const currentModels = getCurrentModels();

  const doesModelExist = currentModels.includes(model);

  return doesModelExist;
}
