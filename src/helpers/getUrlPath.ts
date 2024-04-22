import { domainPath } from '../constants/imageGeneration';

export function getMultipleUrlPaths(imageFilepaths: string[]): String[] {
  return imageFilepaths.map((filepath) => {
    const fileName = filepath.split('/').pop();
    const url = `${domainPath}/${fileName}`;

    return url;
  });
}

export function getSingleUrlPath(imageFilepath: string): string {
  const fileName = imageFilepath.split('/').pop();
  const url = `${domainPath}/${fileName}`;

  return url;
}
