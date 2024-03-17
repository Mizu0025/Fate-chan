import fs from 'fs';
import { comfyModelsFolder } from '../constants/imageGeneration';

// check comfyui models folder for contents, return contents
export function getCurrentModels(): string[] {
  const folderContents: string[] = fs.readdirSync(comfyModelsFolder);
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
