import fs from 'fs';
import path from 'path';
import { comfyOutputDirectory } from '../constants/imageGeneration';
import { winstonLogger } from './logger';

// Function to check if a file has a valid image extension
function isImageFile(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ['.png', '.jpg', '.jpeg'].includes(ext);
}

// Function to scan a directory for image files
export function scanDirectory(directory: string): string[] {
  return fs.readdirSync(directory).filter((file: string) => isImageFile(file));
}

// Function to check for new files
export function checkForNewFiles(initialImageFolder: string[], imageCount: number): string[] {
  let newFiles: string[] = [];

  while (newFiles.length < imageCount) {
    const currentFiles = scanDirectory(comfyOutputDirectory);
    newFiles = currentFiles.filter((file) => !initialImageFolder.includes(file));

    // wait 1 second
    new Promise((resolve) => setTimeout(resolve, 1000));
  }

  winstonLogger.info('All new files generated');
  winstonLogger.info('newImagePaths', newFiles);

  return newFiles;
}
