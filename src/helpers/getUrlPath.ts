import { domainPath } from '../constants/imageGeneration';

export function getUrlPath(imageFilepaths: string[]): String[] {
  return imageFilepaths.map((filepath) => {
    const fileName = filepath.split('/').pop();
    const url = `${domainPath}/${fileName}`;

    return url;
  });
}
