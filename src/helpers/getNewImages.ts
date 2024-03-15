import fs from 'fs';
import path from 'path';
import { comfyOutputDirectory } from '../constants/imageGeneration';

// Function to check if a file has a valid image extension
function isImageFile(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ['.png', '.jpg', '.jpeg'].includes(ext);
}

// Function to scan a directory for image files
function scanDirectory(directory: string) {
  return fs.readdirSync(directory).filter((file: string) => isImageFile(file));
}

// Store initial state of the directory
const initialFiles = scanDirectory(comfyOutputDirectory);

// Function to check for new files
export function checkForNewFiles(imageCount: number): string[] {
  let requestedImages: string[] = [];

  const interval = setInterval(() => {
    const currentFiles = scanDirectory(comfyOutputDirectory);
    const newFiles = currentFiles.filter((file: string) => !initialFiles.includes(file));
    if (newFiles.length >= imageCount) {
      console.log('All new files generated');
      clearInterval(interval);
      newFiles.forEach((file) => {
        requestedImages.push(file);
      });
    }
  }, 1000);

  return requestedImages;
}
