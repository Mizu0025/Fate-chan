import { domainPath } from '../constants/imageGeneration';
import { getUrlPath } from '../helpers/getUrlPath'; // Update with the correct path to your module

jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

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
