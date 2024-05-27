import { checkForNewFiles, scanDirectory } from './getNewImages';
import { getMultipleUrlPaths } from './getUrlPath';
import { imagePrompt } from './parsePrompt';
import { generate_txt2img } from '../generateImage';
import { comfyOutputDir } from '../constants/imageGeneration';

export async function requestImageGeneration(parsedPrompt: imagePrompt): Promise<String[]> {
  // check current image folder contents
  const initialImageFolder = scanDirectory(comfyOutputDir);

  // request new image from ComfyUI API
  await generate_txt2img(parsedPrompt);

  // find new image(s) in imageFolder, add to imagesList array
  const newImagesInFolder = checkForNewFiles(initialImageFolder, parsedPrompt.image_count);

  // refactor imageFolder path into domain url, add to imagesList
  const newImagesUrlPath = getMultipleUrlPaths(newImagesInFolder);

  // return imagesList
  return newImagesUrlPath;
}
