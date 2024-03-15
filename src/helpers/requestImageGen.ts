import { checkForNewFiles } from './getNewImages';
import { getUrlPath } from './getUrlPath';
import { imagePrompt } from './parsePrompt';
import { generate_txt2img } from '../generateImage';

export async function requestImageGeneration(parsedPrompt: imagePrompt): Promise<String[]> {
  // request new image from ComfyUI API, await result
  await generate_txt2img(parsedPrompt);

  // find current image in imageFolder, add to imagesList array
  const newImagesInFolder = checkForNewFiles(parsedPrompt.image_count);

  // refactor imageFolder path into domain url, add to imagesList
  const newImagesUrlPath = getUrlPath(newImagesInFolder);

  // return imagesList
  return newImagesUrlPath;
}
