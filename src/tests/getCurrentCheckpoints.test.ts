import { checkpointConfigList } from '../constants/checkpointConfig';
import { getCurrentCheckpoints } from '../helpers/getCurrentCheckpoints';
import fs from 'fs';

jest.mock('fs');

describe('getCurrentModels', () => {
  it('should return an array of checkpoint configurations', () => {
    // Arrange
    const mockCheckpointConfig: checkpointConfigList = {
      models: [
        {
          name: 'mock checkpoint',
          description: 'a mock checkpoint for testing',
          positivePrompt: 'perfect quality, masterwork',
          negativePrompt: 'ugly quality, crayon scribbles',
          width: 1024,
          height: 1024,
          cfg_scale: 2,
          guidance: 1,
          steps: 20,
          ksampler: 'mock sampler',
          clip_skip: 1,
        },
      ],
    };
    const mockJsonConfig = JSON.stringify(mockCheckpointConfig);

    // Act
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockJsonConfig);
    const models = getCurrentCheckpoints();

    // Assert
    expect(models).toEqual(mockCheckpointConfig.models);
  });
});
