import { checkpointConfig } from '../constants/checkpointConfig';
import { getCurrentCheckpoints, doesCheckpointExist } from '../helpers/getCurrentCheckpoints';
import fs from 'fs';

jest.mock('fs');

describe('getCurrentModels', () => {
  it('should return an array of checkpoint configurations', () => {
    // Arrange
    const mockCheckpointConfig: Partial<checkpointConfig>[] = [
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
    ];
    fs.readFileSync.mockReturnValue(mockCheckpointConfig);

    // Act
    const models = getCurrentCheckpoints();

    // Assert
    expect(models).toEqual(mockCheckpointConfig);
  });
});

describe('doesModelExist', () => {
  it('should return true if the model exists', () => {
    expect(doesCheckpointExist('model1.safetensors')).toBe(true);
  });

  it('should return false if the model does not exist', () => {
    expect(doesCheckpointExist('nonexistent_model.safetensors')).toBe(false);
  });
});
