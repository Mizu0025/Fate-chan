import { domainPath } from '../constants/imageGeneration';
import { getUrlPath } from '../helpers/getUrlPath'; // Update with the correct path to your module

describe('getUrlPath', () => {
  test('Converts file paths to URLs', () => {
    // Setup
    const imageFilepaths = ['path/to/image1.png', 'path/to/image2.png', 'path/to/image3.png'];

    // Act
    const result = getUrlPath(imageFilepaths);

    // Assert
    expect(result).toEqual([
      `${domainPath}/image1.png`,
      `${domainPath}/image2.png`,
      `${domainPath}/image3.png`,
    ]);
  });
});
